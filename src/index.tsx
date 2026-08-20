// Saraya Al-Andalus — Hospitality Furniture — App entry
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Bindings } from './lib/auth'
import authRoutes from './routes/api-auth'
import adminRoutes from './routes/api-admin'
import publicRoutes from './routes/api-public'
import pages from './pages/public'
import { adminShell } from './pages/admin-shell'
import { getSettings, esc } from './lib/helpers'

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())

// APIs
app.route('/api/auth', authRoutes)
app.route('/api/admin', adminRoutes)
app.route('/api', publicRoutes)

// Admin SPA
app.get('/admin', (c) => c.html(adminShell()))
app.get('/admin/*', (c) => c.html(adminShell()))

// SEO: robots + sitemap + JSON-LD handled in layout/site
app.get('/robots.txt', (c) => c.text(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${new URL(c.req.url).origin}/sitemap.xml`))

app.get('/sitemap.xml', async (c) => {
  const origin = new URL(c.req.url).origin
  const statics = ['/', '/products', '/services', '/projects', '/about', '/contact', '/quote']
  const prods = await c.env.DB.prepare(`SELECT slug, updated_at FROM products WHERE status='published'`).all()
  const projs = await c.env.DB.prepare(`SELECT slug, updated_at FROM projects WHERE status='published'`).all()
  const url = (loc: string, lastmod?: string) =>
    `<url><loc>${origin}${loc}</loc>${lastmod ? `<lastmod>${lastmod.slice(0, 10)}</lastmod>` : ''}</url>`
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${statics.map(s => url(s)).join('\n')}
${(prods.results as any[]).map(p => url('/products/' + p.slug, p.updated_at)).join('\n')}
${(projs.results as any[]).map(p => url('/projects/' + p.slug, p.updated_at)).join('\n')}
</urlset>`
  return c.body(xml, 200, { 'Content-Type': 'application/xml' })
})

// Public SSR pages (mounted last so /api, /admin take precedence)
app.route('/', pages)

// 404
app.notFound(async (c) => {
  if (c.req.path.startsWith('/api/')) return c.json({ error: 'غير موجود' }, 404)
  let settings: Record<string, string> = {}
  try { settings = await getSettings(c.env.DB) } catch {}
  const name = settings.company_name_ar || 'سرايا الأندلس'
  return c.html(`<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>الصفحة غير موجودة — ${esc(name)}</title><script src="https://cdn.tailwindcss.com"></script><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet"><style>body{font-family:'Cairo',sans-serif}</style></head><body class="bg-[#faf7f2] min-h-screen flex items-center justify-center"><div class="text-center px-4"><p class="text-7xl font-black text-[#b08d57] mb-4">404</p><h1 class="text-2xl font-bold text-[#23201c] mb-6">الصفحة التي تبحث عنها غير موجودة</h1><a href="/" class="inline-block bg-[#b08d57] text-white px-8 py-3 rounded-full font-bold">العودة للرئيسية</a></div></body></html>`, 404)
})

app.onError((err, c) => {
  console.error(err)
  if (c.req.path.startsWith('/api/')) return c.json({ error: 'خطأ داخلي' }, 500)
  return c.html('<h1 style="font-family:sans-serif;text-align:center;margin-top:20vh">حدث خطأ — حاول لاحقاً</h1>', 500)
})

export default app
