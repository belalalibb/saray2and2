// ENG-005 — Public API (/api/*): catalog, search, quote submission, contact, tracking
import { Hono } from 'hono'
import type { Bindings } from '../lib/auth'
import { genRequestRef, track } from '../lib/helpers'

const pub = new Hono<{ Bindings: Bindings }>()

// Catalog: published products with filters
pub.get('/products', async (c) => {
  const q = c.req.query('q') || ''
  const cat = c.req.query('category') || ''
  const featured = c.req.query('featured') || ''
  const limit = Math.min(Number(c.req.query('limit') || 60), 100)
  let sql = `SELECT p.id, p.slug, p.name_ar, p.name_en, p.short_desc_ar, p.main_image, p.is_featured, p.is_new, p.is_offer,
    c.slug AS category_slug, c.name_ar AS category_name
    FROM products p LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.status = 'published'`
  const binds: any[] = []
  if (q) { sql += ' AND (p.name_ar LIKE ? OR p.name_en LIKE ? OR p.short_desc_ar LIKE ?)'; binds.push(`%${q}%`,`%${q}%`,`%${q}%`) }
  if (cat) { sql += ' AND c.slug = ?'; binds.push(cat) }
  if (featured) { sql += ' AND p.is_featured = 1' }
  sql += ' ORDER BY p.is_featured DESC, p.updated_at DESC LIMIT ?'; binds.push(limit)
  const rows = await c.env.DB.prepare(sql).bind(...binds).all()
  return c.json({ products: rows.results })
})

pub.get('/categories', async (c) => {
  const rows = await c.env.DB.prepare(`
    SELECT c.id, c.slug, c.name_ar, c.name_en, c.description_ar, c.image_url, c.icon,
      (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.status='published') AS products_count
    FROM categories c WHERE c.is_active = 1 ORDER BY c.sort_order`).all()
  return c.json({ categories: rows.results })
})

// Quote request → Lead
pub.post('/quote', async (c) => {
  let b: any
  try { b = await c.req.json() } catch { return c.json({ error: 'بيانات غير صالحة' }, 400) }
  const name = String(b.name || '').trim()
  const phone = String(b.phone || '').trim()
  if (!name || name.length < 2) return c.json({ error: 'الاسم مطلوب' }, 400)
  if (!phone || phone.replace(/\D/g, '').length < 8) return c.json({ error: 'رقم هاتف صحيح مطلوب' }, 400)

  const ref = genRequestRef()
  const res = await c.env.DB.prepare(`
    INSERT INTO leads (request_ref, type, name, company, phone, whatsapp, email, project_type, city, units_count, products_requested, message, source)
    VALUES (?, 'quote', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    ref, name, b.company ?? null, phone, b.whatsapp ?? null, b.email ?? null,
    b.project_type ?? null, b.city ?? null, b.units_count ?? null,
    b.products_requested ? JSON.stringify(b.products_requested) : null,
    b.message ?? null, b.source || 'website'
  ).run()

  await c.env.DB.prepare('INSERT INTO notifications (type, title, body, entity, entity_id) VALUES (?, ?, ?, ?, ?)')
    .bind('lead_quote', 'طلب عرض سعر جديد', `${name} — ${phone} (${ref})`, 'leads', res.meta.last_row_id).run()
  track(c.env.DB, 'quote_submit', Number(res.meta.last_row_id), '/quote')
  return c.json({ success: true, request_ref: ref }, 201)
})

// Contact form → Lead (type=contact)
pub.post('/contact', async (c) => {
  let b: any
  try { b = await c.req.json() } catch { return c.json({ error: 'بيانات غير صالحة' }, 400) }
  const name = String(b.name || '').trim()
  const phone = String(b.phone || '').trim()
  const message = String(b.message || '').trim()
  if (!name || !phone || !message) return c.json({ error: 'الاسم والهاتف والرسالة مطلوبة' }, 400)

  const ref = genRequestRef().replace('QR-', 'CT-')
  const res = await c.env.DB.prepare(`
    INSERT INTO leads (request_ref, type, name, phone, email, message, source)
    VALUES (?, 'contact', ?, ?, ?, ?, 'contact_page')
  `).bind(ref, name, phone, b.email ?? null, message).run()

  await c.env.DB.prepare('INSERT INTO notifications (type, title, body, entity, entity_id) VALUES (?, ?, ?, ?, ?)')
    .bind('lead_contact', 'رسالة تواصل جديدة', `${name} — ${phone}`, 'leads', res.meta.last_row_id).run()
  track(c.env.DB, 'contact_submit', Number(res.meta.last_row_id), '/contact')
  return c.json({ success: true, request_ref: ref }, 201)
})

// Lightweight analytics tracking
pub.post('/track', async (c) => {
  try {
    const b = await c.req.json()
    const allowed = ['page_view','product_view','whatsapp_click','phone_click']
    if (allowed.includes(b.event)) track(c.env.DB, b.event, b.entity_id ?? null, String(b.path || '').slice(0, 200))
  } catch { /* ignore */ }
  return c.json({ ok: true })
})

export default pub
