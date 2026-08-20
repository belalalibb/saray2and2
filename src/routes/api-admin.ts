// ENG-004 — Admin REST API (/api/admin/*)
import { Hono } from 'hono'
import type { Bindings, AuthUser } from '../lib/auth'
import { requireAuth, requirePerm, audit, hashPassword, hasPerm } from '../lib/auth'
import { slugify } from '../lib/helpers'

type Env = { Bindings: Bindings; Variables: { user: AuthUser } }
const admin = new Hono<Env>()

admin.use('*', requireAuth())

// ---------- Dashboard stats ----------
admin.get('/stats', async (c) => {
  const db = c.env.DB
  const row = await db.prepare(`SELECT
    (SELECT COUNT(*) FROM products) AS products_total,
    (SELECT COUNT(*) FROM products WHERE status='published') AS products_published,
    (SELECT COUNT(*) FROM categories) AS categories_total,
    (SELECT COUNT(*) FROM services) AS services_total,
    (SELECT COUNT(*) FROM projects) AS projects_total,
    (SELECT COUNT(*) FROM leads) AS leads_total,
    (SELECT COUNT(*) FROM leads WHERE status='new') AS leads_new,
    (SELECT COUNT(*) FROM leads WHERE type='quote') AS quotes_total,
    (SELECT COUNT(*) FROM leads WHERE type='contact') AS messages_total,
    (SELECT COUNT(*) FROM analytics_events WHERE event_type='page_view') AS page_views,
    (SELECT COUNT(*) FROM analytics_events WHERE event_type='whatsapp_click') AS whatsapp_clicks
  `).first<any>()
  const recentLeads = await db.prepare('SELECT id, request_ref, type, name, phone, status, created_at FROM leads ORDER BY created_at DESC LIMIT 6').all()
  const recentAudit = await db.prepare('SELECT user_email, action, entity, entity_id, created_at FROM audit_log ORDER BY created_at DESC LIMIT 10').all()
  return c.json({ stats: row, recent_leads: recentLeads.results, recent_activity: recentAudit.results })
})

// ---------- Products ----------
admin.get('/products', requirePerm('products'), async (c) => {
  const q = c.req.query('q') || ''
  const status = c.req.query('status') || ''
  const cat = c.req.query('category_id') || ''
  let sql = `SELECT p.*, c.name_ar AS category_name FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE 1=1`
  const binds: any[] = []
  if (q) { sql += ' AND (p.name_ar LIKE ? OR p.name_en LIKE ? OR p.sku LIKE ?)'; binds.push(`%${q}%`, `%${q}%`, `%${q}%`) }
  if (status) { sql += ' AND p.status = ?'; binds.push(status) }
  if (cat) { sql += ' AND p.category_id = ?'; binds.push(Number(cat)) }
  sql += ' ORDER BY p.updated_at DESC LIMIT 200'
  const rows = await c.env.DB.prepare(sql).bind(...binds).all()
  return c.json({ products: rows.results })
})

admin.get('/products/:id', requirePerm('products'), async (c) => {
  const id = Number(c.req.param('id'))
  const p = await c.env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first()
  if (!p) return c.json({ error: 'غير موجود' }, 404)
  const images = await c.env.DB.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order').bind(id).all()
  return c.json({ product: p, images: images.results })
})

const PRODUCT_FIELDS = ['sku','name_ar','name_en','short_desc_ar','short_desc_en','description_ar','description_en','category_id','main_image','specifications','materials_ar','materials_en','dimensions','features_ar','features_en','price','show_price','is_featured','is_new','is_offer','status','seo_title','seo_description','og_image'] as const

admin.post('/products', requirePerm('products'), async (c) => {
  const b = await c.req.json()
  if (!b.name_ar) return c.json({ error: 'الاسم بالعربية مطلوب' }, 400)
  const slug = b.slug ? slugify(b.slug) : slugify(b.name_ar)
  const vals = PRODUCT_FIELDS.map(f => b[f] ?? null)
  const res = await c.env.DB.prepare(
    `INSERT INTO products (slug, ${PRODUCT_FIELDS.join(',')}) VALUES (?${',?'.repeat(PRODUCT_FIELDS.length)})`
  ).bind(slug + '-' + Date.now().toString(36), ...vals).run()
  const id = res.meta.last_row_id
  // try nicer slug (unique check)
  const exists = await c.env.DB.prepare('SELECT id FROM products WHERE slug = ? AND id != ?').bind(slug, id).first()
  if (!exists) await c.env.DB.prepare('UPDATE products SET slug = ? WHERE id = ?').bind(slug, id).run()
  if (Array.isArray(b.images)) {
    for (let i = 0; i < b.images.length; i++) {
      await c.env.DB.prepare('INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)').bind(id, b.images[i], i).run()
    }
  }
  await audit(c.env.DB, c.get('user'), 'create', 'products', Number(id), { name: b.name_ar })
  return c.json({ id }, 201)
})

admin.put('/products/:id', requirePerm('products'), async (c) => {
  const id = Number(c.req.param('id'))
  const b = await c.req.json()
  const sets: string[] = []; const binds: any[] = []
  for (const f of PRODUCT_FIELDS) if (f in b) { sets.push(`${f} = ?`); binds.push(b[f]) }
  if (b.slug) { sets.push('slug = ?'); binds.push(slugify(b.slug)) }
  if (!sets.length && !Array.isArray(b.images)) return c.json({ error: 'لا توجد تعديلات' }, 400)
  if (sets.length) {
    sets.push("updated_at = datetime('now')", 'updated_by = ?'); binds.push(c.get('user').id, id)
    await c.env.DB.prepare(`UPDATE products SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run()
  }
  if (Array.isArray(b.images)) {
    await c.env.DB.prepare('DELETE FROM product_images WHERE product_id = ?').bind(id).run()
    for (let i = 0; i < b.images.length; i++) {
      await c.env.DB.prepare('INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)').bind(id, b.images[i], i).run()
    }
  }
  await audit(c.env.DB, c.get('user'), 'update', 'products', id)
  return c.json({ success: true })
})

admin.delete('/products/:id', requirePerm('products'), async (c) => {
  const id = Number(c.req.param('id'))
  await c.env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run()
  await audit(c.env.DB, c.get('user'), 'delete', 'products', id)
  return c.json({ success: true })
})

// ---------- Categories ----------
admin.get('/categories', requirePerm('categories'), async (c) => {
  const rows = await c.env.DB.prepare(`
    SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS products_count
    FROM categories c ORDER BY c.sort_order`).all()
  return c.json({ categories: rows.results })
})

const CAT_FIELDS = ['name_ar','name_en','description_ar','description_en','image_url','icon','parent_id','sort_order','is_active','seo_title','seo_description'] as const

admin.post('/categories', requirePerm('categories'), async (c) => {
  const b = await c.req.json()
  if (!b.name_ar) return c.json({ error: 'الاسم بالعربية مطلوب' }, 400)
  const slug = slugify(b.slug || b.name_ar)
  const vals = CAT_FIELDS.map(f => b[f] ?? null)
  const res = await c.env.DB.prepare(
    `INSERT INTO categories (slug, ${CAT_FIELDS.join(',')}) VALUES (?${',?'.repeat(CAT_FIELDS.length)})`
  ).bind(slug + '-' + Date.now().toString(36), ...vals).run()
  const id = res.meta.last_row_id
  const exists = await c.env.DB.prepare('SELECT id FROM categories WHERE slug = ? AND id != ?').bind(slug, id).first()
  if (!exists) await c.env.DB.prepare('UPDATE categories SET slug = ? WHERE id = ?').bind(slug, id).run()
  await audit(c.env.DB, c.get('user'), 'create', 'categories', Number(id))
  return c.json({ id }, 201)
})

admin.put('/categories/:id', requirePerm('categories'), async (c) => {
  const id = Number(c.req.param('id'))
  const b = await c.req.json()
  const sets: string[] = []; const binds: any[] = []
  for (const f of CAT_FIELDS) if (f in b) { sets.push(`${f} = ?`); binds.push(b[f]) }
  if (!sets.length) return c.json({ error: 'لا توجد تعديلات' }, 400)
  sets.push("updated_at = datetime('now')"); binds.push(id)
  await c.env.DB.prepare(`UPDATE categories SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run()
  await audit(c.env.DB, c.get('user'), 'update', 'categories', id)
  return c.json({ success: true })
})

admin.delete('/categories/:id', requirePerm('categories'), async (c) => {
  const id = Number(c.req.param('id'))
  const used = await c.env.DB.prepare('SELECT COUNT(*) AS n FROM products WHERE category_id = ?').bind(id).first<any>()
  if (used && used.n > 0) return c.json({ error: `لا يمكن الحذف — يوجد ${used.n} منتج مرتبط بهذه الفئة` }, 409)
  await c.env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run()
  await audit(c.env.DB, c.get('user'), 'delete', 'categories', id)
  return c.json({ success: true })
})

// ---------- Services ----------
const SVC_FIELDS = ['title_ar','title_en','short_desc_ar','short_desc_en','description_ar','description_en','image_url','icon','features_ar','features_en','sort_order','is_active','seo_title','seo_description'] as const

admin.get('/services', requirePerm('services'), async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM services ORDER BY sort_order').all()
  return c.json({ services: rows.results })
})

admin.post('/services', requirePerm('services'), async (c) => {
  const b = await c.req.json()
  if (!b.title_ar) return c.json({ error: 'العنوان بالعربية مطلوب' }, 400)
  const slug = slugify(b.slug || b.title_ar) + '-' + Date.now().toString(36)
  const vals = SVC_FIELDS.map(f => b[f] ?? null)
  const res = await c.env.DB.prepare(
    `INSERT INTO services (slug, ${SVC_FIELDS.join(',')}) VALUES (?${',?'.repeat(SVC_FIELDS.length)})`
  ).bind(slug, ...vals).run()
  await audit(c.env.DB, c.get('user'), 'create', 'services', Number(res.meta.last_row_id))
  return c.json({ id: res.meta.last_row_id }, 201)
})

admin.put('/services/:id', requirePerm('services'), async (c) => {
  const id = Number(c.req.param('id'))
  const b = await c.req.json()
  const sets: string[] = []; const binds: any[] = []
  for (const f of SVC_FIELDS) if (f in b) { sets.push(`${f} = ?`); binds.push(b[f]) }
  if (!sets.length) return c.json({ error: 'لا توجد تعديلات' }, 400)
  sets.push("updated_at = datetime('now')"); binds.push(id)
  await c.env.DB.prepare(`UPDATE services SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run()
  await audit(c.env.DB, c.get('user'), 'update', 'services', id)
  return c.json({ success: true })
})

admin.delete('/services/:id', requirePerm('services'), async (c) => {
  const id = Number(c.req.param('id'))
  await c.env.DB.prepare('DELETE FROM services WHERE id = ?').bind(id).run()
  await audit(c.env.DB, c.get('user'), 'delete', 'services', id)
  return c.json({ success: true })
})

// ---------- Projects ----------
const PRJ_FIELDS = ['title_ar','title_en','description_ar','description_en','cover_image','client_name','location','project_type','project_date','is_featured','status'] as const

admin.get('/projects', requirePerm('projects'), async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM projects ORDER BY created_at DESC').all()
  return c.json({ projects: rows.results })
})

admin.get('/projects/:id', requirePerm('projects'), async (c) => {
  const id = Number(c.req.param('id'))
  const p = await c.env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first()
  if (!p) return c.json({ error: 'غير موجود' }, 404)
  const images = await c.env.DB.prepare('SELECT * FROM project_images WHERE project_id = ? ORDER BY sort_order').bind(id).all()
  return c.json({ project: p, images: images.results })
})

admin.post('/projects', requirePerm('projects'), async (c) => {
  const b = await c.req.json()
  if (!b.title_ar) return c.json({ error: 'العنوان بالعربية مطلوب' }, 400)
  const slug = slugify(b.slug || b.title_ar) + '-' + Date.now().toString(36)
  const vals = PRJ_FIELDS.map(f => b[f] ?? null)
  const res = await c.env.DB.prepare(
    `INSERT INTO projects (slug, ${PRJ_FIELDS.join(',')}) VALUES (?${',?'.repeat(PRJ_FIELDS.length)})`
  ).bind(slug, ...vals).run()
  const id = res.meta.last_row_id
  if (Array.isArray(b.images)) {
    for (let i = 0; i < b.images.length; i++) {
      await c.env.DB.prepare('INSERT INTO project_images (project_id, url, sort_order) VALUES (?, ?, ?)').bind(id, b.images[i], i).run()
    }
  }
  await audit(c.env.DB, c.get('user'), 'create', 'projects', Number(id))
  return c.json({ id }, 201)
})

admin.put('/projects/:id', requirePerm('projects'), async (c) => {
  const id = Number(c.req.param('id'))
  const b = await c.req.json()
  const sets: string[] = []; const binds: any[] = []
  for (const f of PRJ_FIELDS) if (f in b) { sets.push(`${f} = ?`); binds.push(b[f]) }
  if (sets.length) {
    sets.push("updated_at = datetime('now')"); binds.push(id)
    await c.env.DB.prepare(`UPDATE projects SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run()
  }
  if (Array.isArray(b.images)) {
    await c.env.DB.prepare('DELETE FROM project_images WHERE project_id = ?').bind(id).run()
    for (let i = 0; i < b.images.length; i++) {
      await c.env.DB.prepare('INSERT INTO project_images (project_id, url, sort_order) VALUES (?, ?, ?)').bind(id, b.images[i], i).run()
    }
  }
  await audit(c.env.DB, c.get('user'), 'update', 'projects', id)
  return c.json({ success: true })
})

admin.delete('/projects/:id', requirePerm('projects'), async (c) => {
  const id = Number(c.req.param('id'))
  await c.env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(id).run()
  await audit(c.env.DB, c.get('user'), 'delete', 'projects', id)
  return c.json({ success: true })
})

// ---------- Leads ----------
admin.get('/leads', requirePerm('leads'), async (c) => {
  const status = c.req.query('status') || ''
  const type = c.req.query('type') || ''
  const q = c.req.query('q') || ''
  let sql = 'SELECT * FROM leads WHERE 1=1'
  const binds: any[] = []
  if (status) { sql += ' AND status = ?'; binds.push(status) }
  if (type) { sql += ' AND type = ?'; binds.push(type) }
  if (q) { sql += ' AND (name LIKE ? OR phone LIKE ? OR company LIKE ? OR request_ref LIKE ?)'; binds.push(`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`) }
  sql += ' ORDER BY created_at DESC LIMIT 300'
  const rows = await c.env.DB.prepare(sql).bind(...binds).all()
  return c.json({ leads: rows.results })
})

admin.get('/leads/:id', requirePerm('leads'), async (c) => {
  const id = Number(c.req.param('id'))
  const lead = await c.env.DB.prepare('SELECT * FROM leads WHERE id = ?').bind(id).first()
  if (!lead) return c.json({ error: 'غير موجود' }, 404)
  const notes = await c.env.DB.prepare(`
    SELECT n.*, u.name AS user_name FROM lead_notes n LEFT JOIN admin_users u ON u.id = n.user_id
    WHERE n.lead_id = ? ORDER BY n.created_at DESC`).bind(id).all()
  return c.json({ lead, notes: notes.results })
})

const LEAD_STATUSES = ['new','contacted','qualified','quotation_sent','negotiation','won','lost','archived']

admin.put('/leads/:id', requirePerm('leads'), async (c) => {
  const id = Number(c.req.param('id'))
  const b = await c.req.json()
  const sets: string[] = []; const binds: any[] = []
  if (b.status) {
    if (!LEAD_STATUSES.includes(b.status)) return c.json({ error: 'حالة غير صالحة' }, 400)
    sets.push('status = ?'); binds.push(b.status)
  }
  if ('assigned_to' in b) { sets.push('assigned_to = ?'); binds.push(b.assigned_to) }
  if (!sets.length) return c.json({ error: 'لا توجد تعديلات' }, 400)
  sets.push("updated_at = datetime('now')"); binds.push(id)
  await c.env.DB.prepare(`UPDATE leads SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run()
  await audit(c.env.DB, c.get('user'), 'update', 'leads', id, { status: b.status })
  return c.json({ success: true })
})

admin.post('/leads/:id/notes', requirePerm('leads'), async (c) => {
  const id = Number(c.req.param('id'))
  const b = await c.req.json()
  if (!b.note) return c.json({ error: 'الملاحظة مطلوبة' }, 400)
  await c.env.DB.prepare('INSERT INTO lead_notes (lead_id, user_id, note) VALUES (?, ?, ?)')
    .bind(id, c.get('user').id, String(b.note)).run()
  return c.json({ success: true }, 201)
})

admin.delete('/leads/:id', requirePerm('leads'), async (c) => {
  const id = Number(c.req.param('id'))
  await c.env.DB.prepare('DELETE FROM leads WHERE id = ?').bind(id).run()
  await audit(c.env.DB, c.get('user'), 'delete', 'leads', id)
  return c.json({ success: true })
})

// ---------- Homepage CMS ----------
admin.get('/homepage', requirePerm('homepage'), async (c) => {
  const sections = await c.env.DB.prepare('SELECT * FROM home_sections ORDER BY sort_order').all()
  const whyUs = await c.env.DB.prepare('SELECT * FROM why_us_points ORDER BY sort_order').all()
  return c.json({ sections: sections.results, why_us: whyUs.results })
})

admin.put('/homepage/sections/:id', requirePerm('homepage'), async (c) => {
  const id = Number(c.req.param('id'))
  const b = await c.req.json()
  const FIELDS = ['title_ar','title_en','content_ar','content_en','image_url','cta_text_ar','cta_url','extra','sort_order','is_active']
  const sets: string[] = []; const binds: any[] = []
  for (const f of FIELDS) if (f in b) { sets.push(`${f} = ?`); binds.push(b[f]) }
  if (!sets.length) return c.json({ error: 'لا توجد تعديلات' }, 400)
  sets.push("updated_at = datetime('now')"); binds.push(id)
  await c.env.DB.prepare(`UPDATE home_sections SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run()
  await audit(c.env.DB, c.get('user'), 'update', 'home_sections', id)
  return c.json({ success: true })
})

admin.post('/homepage/why-us', requirePerm('homepage'), async (c) => {
  const b = await c.req.json()
  if (!b.title_ar) return c.json({ error: 'العنوان مطلوب' }, 400)
  const res = await c.env.DB.prepare('INSERT INTO why_us_points (icon, title_ar, title_en, description_ar, description_en, sort_order) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(b.icon ?? null, b.title_ar, b.title_en ?? null, b.description_ar ?? null, b.description_en ?? null, b.sort_order ?? 0).run()
  return c.json({ id: res.meta.last_row_id }, 201)
})

admin.put('/homepage/why-us/:id', requirePerm('homepage'), async (c) => {
  const id = Number(c.req.param('id'))
  const b = await c.req.json()
  const FIELDS = ['icon','title_ar','title_en','description_ar','description_en','sort_order','is_active']
  const sets: string[] = []; const binds: any[] = []
  for (const f of FIELDS) if (f in b) { sets.push(`${f} = ?`); binds.push(b[f]) }
  if (!sets.length) return c.json({ error: 'لا توجد تعديلات' }, 400)
  binds.push(id)
  await c.env.DB.prepare(`UPDATE why_us_points SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run()
  return c.json({ success: true })
})

admin.delete('/homepage/why-us/:id', requirePerm('homepage'), async (c) => {
  await c.env.DB.prepare('DELETE FROM why_us_points WHERE id = ?').bind(Number(c.req.param('id'))).run()
  return c.json({ success: true })
})

// ---------- Settings ----------
admin.get('/settings', async (c) => {
  const user = c.get('user')
  if (!hasPerm(user.role, 'homepage') && user.role !== 'super_admin') return c.json({ error: 'ليس لديك صلاحية' }, 403)
  const rows = await c.env.DB.prepare('SELECT key, value FROM settings').all()
  return c.json({ settings: rows.results })
})

admin.put('/settings', async (c) => {
  const user = c.get('user')
  if (user.role !== 'super_admin' && user.role !== 'content_manager') return c.json({ error: 'ليس لديك صلاحية' }, 403)
  const b = await c.req.json()
  if (!b || typeof b !== 'object') return c.json({ error: 'بيانات غير صالحة' }, 400)
  for (const [k, v] of Object.entries(b)) {
    await c.env.DB.prepare("INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')")
      .bind(k, String(v)).run()
  }
  await audit(c.env.DB, user, 'update', 'settings', null, { keys: Object.keys(b) })
  return c.json({ success: true })
})

// ---------- Users (super_admin only) ----------
function requireSuper() {
  return async (c: any, next: any) => {
    if (c.get('user').role !== 'super_admin') return c.json({ error: 'مخصص للمدير العام فقط' }, 403)
    await next()
  }
}

admin.get('/users', requireSuper(), async (c) => {
  const rows = await c.env.DB.prepare('SELECT id, email, name, role, is_active, last_login_at, created_at FROM admin_users ORDER BY id').all()
  return c.json({ users: rows.results })
})

admin.post('/users', requireSuper(), async (c) => {
  const b = await c.req.json()
  if (!b.email || !b.name || !b.password) return c.json({ error: 'البريد والاسم وكلمة المرور مطلوبة' }, 400)
  if (String(b.password).length < 8) return c.json({ error: 'كلمة المرور 8 أحرف على الأقل' }, 400)
  const role = ['super_admin','content_manager','sales','editor'].includes(b.role) ? b.role : 'editor'
  const { hash, salt } = await hashPassword(String(b.password))
  try {
    const res = await c.env.DB.prepare('INSERT INTO admin_users (email, name, password_hash, password_salt, role) VALUES (?, ?, ?, ?, ?)')
      .bind(String(b.email).toLowerCase(), b.name, hash, salt, role).run()
    await audit(c.env.DB, c.get('user'), 'create', 'admin_users', Number(res.meta.last_row_id))
    return c.json({ id: res.meta.last_row_id }, 201)
  } catch { return c.json({ error: 'البريد مستخدم بالفعل' }, 409) }
})

admin.put('/users/:id', requireSuper(), async (c) => {
  const id = Number(c.req.param('id'))
  const b = await c.req.json()
  const sets: string[] = []; const binds: any[] = []
  if (b.name) { sets.push('name = ?'); binds.push(b.name) }
  if (b.role) { sets.push('role = ?'); binds.push(b.role) }
  if ('is_active' in b) {
    if (id === c.get('user').id && !b.is_active) return c.json({ error: 'لا يمكنك تعطيل حسابك' }, 400)
    sets.push('is_active = ?'); binds.push(b.is_active ? 1 : 0)
  }
  if (b.password) {
    if (String(b.password).length < 8) return c.json({ error: 'كلمة المرور 8 أحرف على الأقل' }, 400)
    const { hash, salt } = await hashPassword(String(b.password))
    sets.push('password_hash = ?', 'password_salt = ?'); binds.push(hash, salt)
  }
  if (!sets.length) return c.json({ error: 'لا توجد تعديلات' }, 400)
  sets.push("updated_at = datetime('now')"); binds.push(id)
  await c.env.DB.prepare(`UPDATE admin_users SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run()
  await audit(c.env.DB, c.get('user'), 'update', 'admin_users', id)
  return c.json({ success: true })
})

admin.delete('/users/:id', requireSuper(), async (c) => {
  const id = Number(c.req.param('id'))
  if (id === c.get('user').id) return c.json({ error: 'لا يمكنك حذف حسابك' }, 400)
  await c.env.DB.prepare('DELETE FROM admin_users WHERE id = ?').bind(id).run()
  await audit(c.env.DB, c.get('user'), 'delete', 'admin_users', id)
  return c.json({ success: true })
})

// ---------- Audit log ----------
admin.get('/audit', requireSuper(), async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 200').all()
  return c.json({ audit: rows.results })
})

// ---------- Media library ----------
admin.get('/media', requirePerm('media'), async (c) => {
  // Static catalog images + media table entries
  const staticImages = [
    'hero-main', 'bedroom-1','bedroom-2','bedroom-3','bedroom-4','bedroom-5','bedroom-6','bedroom-7','bedroom-8',
    'living-1','living-2','living-3','living-4','living-5','living-6','living-7','living-8',
    'dining-1','dining-2','dining-3','dining-4','dining-5','dining-6','dining-7','dining-8',
    'office-1','office-2','office-3','office-4','office-5',
    'storage-1','storage-2','storage-3','storage-6'
  ].map(n => ({ url: `/static/images/${n}.jpg`, filename: `${n}.jpg`, source: 'catalog' }))
  const rows = await c.env.DB.prepare('SELECT id, url, filename, mime_type, size, alt_text, created_at FROM media ORDER BY created_at DESC LIMIT 200').all()
  return c.json({ media: [...(rows.results as any[]).map(m => ({ ...m, source: 'upload' })), ...staticImages] })
})

// Upload image from device (base64 stored in D1 — no R2 needed on free tier)
admin.post('/media/upload', requirePerm('media'), async (c) => {
  let b: any
  try { b = await c.req.json() } catch { return c.json({ error: 'بيانات غير صالحة' }, 400) }
  let data = String(b.data || '')
  let mime = String(b.mime_type || 'image/jpeg')
  // Accept data URLs
  const m = data.match(/^data:([\w/+.-]+);base64,(.+)$/)
  if (m) { mime = m[1]; data = m[2] }
  if (!data || !/^[A-Za-z0-9+/=\s]+$/.test(data.slice(0, 200))) return c.json({ error: 'صورة غير صالحة' }, 400)
  if (!/^image\//.test(mime)) return c.json({ error: 'يُسمح بملفات الصور فقط' }, 400)
  if (data.length > 1_800_000) return c.json({ error: 'حجم الصورة كبير جداً (الحد الأقصى ~1.3MB بعد الضغط)' }, 413)
  const size = Math.floor(data.length * 3 / 4)
  const filename = String(b.filename || 'upload.jpg').slice(0, 120)
  const res = await c.env.DB.prepare('INSERT INTO media (url, filename, mime_type, size, alt_text, data) VALUES (?, ?, ?, ?, ?, ?)')
    .bind('', filename, mime, size, b.alt_text ?? null, data).run()
  const id = Number(res.meta.last_row_id)
  const url = `/api/media/file/${id}`
  await c.env.DB.prepare('UPDATE media SET url = ? WHERE id = ?').bind(url, id).run()
  await audit(c.env.DB, c.get('user'), 'create', 'media', id, { filename, size })
  return c.json({ id, url, filename }, 201)
})

admin.delete('/media/:id', requirePerm('media'), async (c) => {
  const id = Number(c.req.param('id'))
  await c.env.DB.prepare('DELETE FROM media WHERE id = ?').bind(id).run()
  await audit(c.env.DB, c.get('user'), 'delete', 'media', id)
  return c.json({ success: true })
})

export default admin
