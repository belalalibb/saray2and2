import { Hono } from 'hono'
import type { Bindings } from '../lib'

const pub = new Hono<{ Bindings: Bindings }>()

pub.get('/categories', async (c) => {
  const rows = await c.env.DB.prepare(
    "SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.status='published') products_count FROM categories c WHERE c.is_active = 1 ORDER BY c.sort_order"
  ).all()
  return c.json({ categories: rows.results })
})

pub.get('/products', async (c) => {
  const { category, q, featured } = c.req.query()
  let sql = "SELECT p.*, c.name_ar category_name, c.slug category_slug FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE p.status = 'published'"
  const binds: any[] = []
  if (category) { sql += ' AND c.slug = ?'; binds.push(category) }
  if (q) { sql += ' AND (p.name_ar LIKE ? OR p.short_desc_ar LIKE ?)'; binds.push(`%${q}%`, `%${q}%`) }
  if (featured) sql += ' AND p.is_featured = 1'
  sql += ' ORDER BY p.created_at DESC'
  const rows = await c.env.DB.prepare(sql).bind(...binds).all()
  return c.json({ products: rows.results })
})

pub.post('/leads', async (c) => {
  const b = await c.req.json().catch(() => ({}))
  if (!b.name || !b.phone) return c.json({ error: 'الاسم ورقم الجوال مطلوبان' }, 400)
  const res = await c.env.DB.prepare(
    'INSERT INTO leads (name, phone, email, message, source, product_id) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(b.name, b.phone, b.email ?? null, b.message ?? null, b.source ?? 'contact_form', b.product_id ?? null).run()
  return c.json({ id: res.meta.last_row_id, message: 'تم استلام طلبك، سنتواصل معك قريباً' }, 201)
})

export default pub
