import { Hono } from 'hono'
import type { Bindings, Vars } from '../lib'
import { slugify, audit, hasPerm, hashPassword } from '../lib'
import { requireAuth } from './api-auth'

const admin = new Hono<{ Bindings: Bindings; Variables: Vars }>()
admin.use('*', requireAuth)

const requirePerm = (perm: string) => async (c: any, next: any) => {
  const u = c.get('user')
  if (!hasPerm(u.role, perm)) return c.json({ error: 'لا تملك صلاحية الوصول لهذا القسم' }, 403)
  await next()
}

// ---------- Dashboard ----------
admin.get('/dashboard', async (c) => {
  const db = c.env.DB
  const [products, published, categories, services, projects, leadsNew, leadsAll, users] = await Promise.all([
    db.prepare('SELECT COUNT(*) n FROM products').first<any>(),
    db.prepare("SELECT COUNT(*) n FROM products WHERE status='published'").first<any>(),
    db.prepare('SELECT COUNT(*) n FROM categories').first<any>(),
    db.prepare('SELECT COUNT(*) n FROM services').first<any>(),
    db.prepare('SELECT COUNT(*) n FROM projects').first<any>(),
    db.prepare("SELECT COUNT(*) n FROM leads WHERE status='new'").first<any>(),
    db.prepare('SELECT COUNT(*) n FROM leads').first<any>(),
    db.prepare('SELECT COUNT(*) n FROM users').first<any>(),
  ])
  const recentLeads = await db.prepare('SELECT * FROM leads ORDER BY created_at DESC LIMIT 5').all()
  const topProducts = await db.prepare("SELECT id, name_ar, views, main_image FROM products ORDER BY views DESC LIMIT 5").all()
  return c.json({
    stats: {
      products: products?.n ?? 0, published: published?.n ?? 0, categories: categories?.n ?? 0,
      services: services?.n ?? 0, projects: projects?.n ?? 0,
      leads_new: leadsNew?.n ?? 0, leads_all: leadsAll?.n ?? 0, users: users?.n ?? 0
    },
    recent_leads: recentLeads.results, top_products: topProducts.results
  })
})

// ---------- Categories ----------
const CAT_FIELDS = ['name_ar','name_en','description_ar','icon','image_url','sort_order','is_active'] as const

admin.get('/categories', requirePerm('categories'), async (c) => {
  const rows = await c.env.DB.prepare(
    'SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) products_count FROM categories c ORDER BY c.sort_order'
  ).all()
  return c.json({ categories: rows.results })
})

admin.post('/categories', requirePerm('categories'), async (c) => {
  const b = await c.req.json()
  if (!b.name_ar) return c.json({ error: 'الاسم بالعربية مطلوب' }, 400)
  const slug = slugify(b.slug || b.name_en || b.name_ar) + '-' + Date.now().toString(36)
  const vals = CAT_FIELDS.map(f => b[f] ?? null)
  const res = await c.env.DB.prepare(
    `INSERT INTO categories (slug, ${CAT_FIELDS.join(',')}) VALUES (?${',?'.repeat(CAT_FIELDS.length)})`
  ).bind(slug, ...vals).run()
  await audit(c.env.DB, c.get('user'), 'create', 'categories', Number(res.meta.last_row_id))
  return c.json({ id: res.meta.last_row_id }, 201)
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
  await c.env.DB.prepare('UPDATE products SET category_id = NULL WHERE category_id = ?').bind(id).run()
  await c.env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run()
  await audit(c.env.DB, c.get('user'), 'delete', 'categories', id)
  return c.json({ success: true })
})

// ---------- Products ----------
const PROD_FIELDS = ['sku','name_ar','name_en','short_desc_ar','description_ar','features_ar','materials_ar','dimensions','price','show_price','main_image','category_id','is_featured','is_new','is_offer','status','seo_title','seo_description'] as const

admin.get('/products', requirePerm('products'), async (c) => {
  const rows = await c.env.DB.prepare(
    'SELECT p.*, c.name_ar category_name FROM products p LEFT JOIN categories c ON c.id = p.category_id ORDER BY p.created_at DESC'
  ).all()
  return c.json({ products: rows.results })
})

admin.get('/products/:id', requirePerm('products'), async (c) => {
  const id = Number(c.req.param('id'))
  const p = await c.env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first()
  if (!p) return c.json({ error: 'غير موجود' }, 404)
  const images = await c.env.DB.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order').bind(id).all()
  return c.json({ product: p, images: images.results })
})

admin.post('/products', requirePerm('products'), async (c) => {
  const b = await c.req.json()
  if (!b.name_ar) return c.json({ error: 'الاسم بالعربية مطلوب' }, 400)
  const slug = slugify(b.slug || b.name_en || b.name_ar) + '-' + Date.now().toString(36)
  const vals = PROD_FIELDS.map(f => b[f] ?? null)
  const res = await c.env.DB.prepare(
    `INSERT INTO products (slug, ${PROD_FIELDS.join(',')}) VALUES (?${',?'.repeat(PROD_FIELDS.length)})`
  ).bind(slug, ...vals).run()
  const id = res.meta.last_row_id
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
  for (const f of PROD_FIELDS) if (f in b) { sets.push(`${f} = ?`); binds.push(b[f]) }
  if (sets.length) {
    sets.push("updated_at = datetime('now')"); binds.push(id)
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
  const status = c.req.query('status')
  let q = 'SELECT l.*, p.name_ar product_name FROM leads l LEFT JOIN products p ON p.id = l.product_id'
  const binds: any[] = []
  if (status) { q += ' WHERE l.status = ?'; binds.push(status) }
  q += ' ORDER BY l.created_at DESC'
  const rows = await c.env.DB.prepare(q).bind(...binds).all()
  return c.json({ leads: rows.results })
})

admin.put('/leads/:id', requirePerm('leads'), async (c) => {
  const id = Number(c.req.param('id'))
  const b = await c.req.json()
  const sets: string[] = []; const binds: any[] = []
  for (const f of ['status', 'notes']) if (f in b) { sets.push(`${f} = ?`); binds.push(b[f]) }
  if (!sets.length) return c.json({ error: 'لا توجد تعديلات' }, 400)
  sets.push("updated_at = datetime('now')"); binds.push(id)
  await c.env.DB.prepare(`UPDATE leads SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run()
  await audit(c.env.DB, c.get('user'), 'update', 'leads', id)
  return c.json({ success: true })
})

admin.delete('/leads/:id', requirePerm('leads'), async (c) => {
  const id = Number(c.req.param('id'))
  await c.env.DB.prepare('DELETE FROM leads WHERE id = ?').bind(id).run()
  await audit(c.env.DB, c.get('user'), 'delete', 'leads', id)
  return c.json({ success: true })
})

// ---------- Homepage CMS ----------
admin.get('/homepage', requirePerm('homepage'), async (c) => {
  const sections = await c.env.DB.prepare('SELECT * FROM homepage_sections ORDER BY sort_order').all()
  const whyUs = await c.env.DB.prepare('SELECT * FROM why_us ORDER BY sort_order').all()
  return c.json({ sections: sections.results, why_us: whyUs.results })
})

admin.put('/homepage/sections/:id', requirePerm('homepage'), async (c) => {
  const id = Number(c.req.param('id'))
  const b = await c.req.json()
  const sets: string[] = []; const binds: any[] = []
  for (const f of ['title_ar','content_ar','image_url','cta_text_ar','cta_url','sort_order','is_active']) if (f in b) { sets.push(`${f} = ?`); binds.push(b[f]) }
  if (!sets.length) return c.json({ error: 'لا توجد تعديلات' }, 400)
  sets.push("updated_at = datetime('now')"); binds.push(id)
  await c.env.DB.prepare(`UPDATE homepage_sections SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run()
  await audit(c.env.DB, c.get('user'), 'update', 'homepage_sections', id)
  return c.json({ success: true })
})

admin.post('/homepage/why-us', requirePerm('homepage'), async (c) => {
  const b = await c.req.json()
  if (!b.title_ar) return c.json({ error: 'العنوان مطلوب' }, 400)
  const res = await c.env.DB.prepare('INSERT INTO why_us (title_ar, description_ar, icon, sort_order) VALUES (?, ?, ?, ?)')
    .bind(b.title_ar, b.description_ar ?? null, b.icon ?? null, b.sort_order ?? 0).run()
  await audit(c.env.DB, c.get('user'), 'create', 'why_us', Number(res.meta.last_row_id))
  return c.json({ id: res.meta.last_row_id }, 201)
})

admin.put('/homepage/why-us/:id', requirePerm('homepage'), async (c) => {
  const id = Number(c.req.param('id'))
  const b = await c.req.json()
  const sets: string[] = []; const binds: any[] = []
  for (const f of ['title_ar','description_ar','icon','sort_order']) if (f in b) { sets.push(`${f} = ?`); binds.push(b[f]) }
  if (!sets.length) return c.json({ error: 'لا توجد تعديلات' }, 400)
  binds.push(id)
  await c.env.DB.prepare(`UPDATE why_us SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run()
  return c.json({ success: true })
})

admin.delete('/homepage/why-us/:id', requirePerm('homepage'), async (c) => {
  await c.env.DB.prepare('DELETE FROM why_us WHERE id = ?').bind(Number(c.req.param('id'))).run()
  return c.json({ success: true })
})

// ---------- Settings ----------
admin.get('/settings', requirePerm('settings'), async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM settings').all()
  return c.json({ settings: rows.results })
})

admin.put('/settings', requirePerm('settings'), async (c) => {
  const b = await c.req.json()
  for (const [key, value] of Object.entries(b)) {
    await c.env.DB.prepare(
      "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')"
    ).bind(key, String(value ?? '')).run()
  }
  await audit(c.env.DB, c.get('user'), 'update', 'settings')
  return c.json({ success: true })
})

// ---------- Users (admin only) ----------
admin.get('/users', requirePerm('users'), async (c) => {
  const rows = await c.env.DB.prepare('SELECT id, email, name, role, is_active, last_login_at, created_at FROM users ORDER BY created_at').all()
  return c.json({ users: rows.results })
})

admin.post('/users', requirePerm('users'), async (c) => {
  const b = await c.req.json()
  if (!b.email || !b.name || !b.password) return c.json({ error: 'الاسم والبريد وكلمة المرور مطلوبة' }, 400)
  const exists = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(String(b.email).toLowerCase()).first()
  if (exists) return c.json({ error: 'البريد مستخدم مسبقاً' }, 400)
  const res = await c.env.DB.prepare('INSERT INTO users (email, name, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?)')
    .bind(String(b.email).toLowerCase(), b.name, await hashPassword(b.password), b.role || 'editor', b.is_active ?? 1).run()
  await audit(c.env.DB, c.get('user'), 'create', 'users', Number(res.meta.last_row_id), { email: b.email })
  return c.json({ id: res.meta.last_row_id }, 201)
})

admin.put('/users/:id', requirePerm('users'), async (c) => {
  const id = Number(c.req.param('id'))
  const b = await c.req.json()
  const me = c.get('user')
  if (id === me.id && b.is_active === 0) return c.json({ error: 'لا يمكنك تعطيل حسابك' }, 400)
  const sets: string[] = []; const binds: any[] = []
  if (b.name) { sets.push('name = ?'); binds.push(b.name) }
  if (b.email) { sets.push('email = ?'); binds.push(String(b.email).toLowerCase()) }
  if (b.role) { sets.push('role = ?'); binds.push(b.role) }
  if ('is_active' in b) { sets.push('is_active = ?'); binds.push(b.is_active) }
  if (b.password) { sets.push('password_hash = ?'); binds.push(await hashPassword(b.password)) }
  if (!sets.length) return c.json({ error: 'لا توجد تعديلات' }, 400)
  sets.push("updated_at = datetime('now')"); binds.push(id)
  await c.env.DB.prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run()
  await audit(c.env.DB, c.get('user'), 'update', 'users', id)
  return c.json({ success: true })
})

admin.delete('/users/:id', requirePerm('users'), async (c) => {
  const id = Number(c.req.param('id'))
  const me = c.get('user')
  if (id === me.id) return c.json({ error: 'لا يمكنك حذف حسابك' }, 400)
  await c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run()
  await audit(c.env.DB, c.get('user'), 'delete', 'users', id)
  return c.json({ success: true })
})

// ---------- Audit log (admin only) ----------
admin.get('/audit', requirePerm('audit'), async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 200').all()
  return c.json({ audit: rows.results })
})

export default admin
