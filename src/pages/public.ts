// ENG-007→011 — Public SSR pages
import { Hono } from 'hono'
import type { Bindings } from '../lib/auth'
import { esc, nl2list, waLink, getSettings, track } from '../lib/helpers'
import { layout } from './layout'

const pages = new Hono<{ Bindings: Bindings }>()

const productCard = (p: any) => `
<article class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow fade-up">
  <a href="/products/${esc(p.slug)}" class="block">
    <figure class="relative h-64 overflow-hidden">
      <img src="${esc(p.main_image || '/static/images/hero-main.jpg')}" alt="${esc(p.name_ar)}" loading="lazy" class="card-img w-full h-full object-cover">
      <div class="absolute top-3 right-3 flex gap-2">
        ${p.is_new ? '<span class="bg-gold text-white text-xs font-bold px-3 py-1 rounded-full">جديد</span>' : ''}
        ${p.is_offer ? '<span class="bg-brown text-white text-xs font-bold px-3 py-1 rounded-full">عرض</span>' : ''}
      </div>
    </figure>
    <div class="p-5">
      ${p.category_name ? `<span class="text-xs text-gold font-semibold">${esc(p.category_name)}</span>` : ''}
      <h3 class="font-bold text-charcoal mt-1 mb-2">${esc(p.name_ar)}</h3>
      <p class="text-sm text-brown/70 leading-6 line-clamp-2">${esc(p.short_desc_ar || '')}</p>
    </div>
  </a>
</article>`

// ---------- HOME ----------
pages.get('/', async (c) => {
  const db = c.env.DB
  const settings = await getSettings(db)
  const [sections, categories, featured, services, projects, whyUs] = await Promise.all([
    db.prepare('SELECT * FROM home_sections WHERE is_active = 1 ORDER BY sort_order').all(),
    db.prepare(`SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id=c.id AND p.status='published') n FROM categories c WHERE c.is_active=1 ORDER BY c.sort_order LIMIT 6`).all(),
    db.prepare(`SELECT p.*, c.name_ar category_name FROM products p LEFT JOIN categories c ON c.id=p.category_id WHERE p.status='published' AND p.is_featured=1 ORDER BY p.updated_at DESC LIMIT 6`).all(),
    db.prepare('SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order LIMIT 6').all(),
    db.prepare(`SELECT * FROM projects WHERE status='published' ORDER BY is_featured DESC, created_at DESC LIMIT 3`).all(),
    db.prepare('SELECT * FROM why_us_points WHERE is_active = 1 ORDER BY sort_order').all(),
  ])
  const sec: Record<string, any> = {}
  for (const s of sections.results as any[]) sec[s.section_key] = s

  const hero = sec.hero || {}
  const about = sec.about || {}
  const cta = sec.cta || {}

  const content = `
<section id="hero-section" class="relative min-h-[82vh] flex items-center">
  <img src="${esc(hero.image_url || '/static/images/hero-main.jpg')}" alt="" class="absolute inset-0 w-full h-full object-cover">
  <div class="absolute inset-0 bg-gradient-to-l from-charcoal/85 via-charcoal/60 to-charcoal/30"></div>
  <div class="relative max-w-7xl mx-auto px-4 py-24 w-full">
    <div class="max-w-2xl fade-up visible">
      <span class="text-gold text-sm font-bold tracking-widest">أثاث فندقي · ضيافة · مشروعات</span>
      <h1 class="text-4xl md:text-6xl font-black text-white leading-tight mt-4 mb-6">${esc(hero.title_ar || 'أثاث فندقي يليق بمشروعك')}</h1>
      <p class="text-cream/85 text-lg leading-8 mb-8">${esc(hero.content_ar || '')}</p>
      <div class="flex flex-wrap gap-4">
        <a href="${esc(hero.cta_url || '/products')}" class="btn-gold px-8 py-3.5 rounded-full font-bold">${esc(hero.cta_text_ar || 'استكشف منتجاتنا')}</a>
        <a href="/quote" class="border border-white/40 text-white px-8 py-3.5 rounded-full font-bold hover:bg-white hover:text-charcoal transition-colors">اطلب عرض سعر</a>
      </div>
    </div>
  </div>
</section>

<section id="about-preview" class="max-w-7xl mx-auto px-4 py-20">
  <div class="grid md:grid-cols-2 gap-12 items-center">
    <div class="fade-up">
      <h2 class="section-title text-3xl font-black text-charcoal mb-6">${esc(about.title_ar || 'من نحن')}</h2>
      <p class="text-brown/80 leading-8 text-lg">${esc(about.content_ar || '')}</p>
      <a href="/about" class="btn-outline inline-block mt-6 px-7 py-3 rounded-full font-bold">${esc(about.cta_text_ar || 'اعرف المزيد')}</a>
    </div>
    <figure class="fade-up grid grid-cols-2 gap-4">
      <img src="/static/images/living-3.jpg" alt="أثاث لوبي" loading="lazy" class="rounded-2xl h-56 w-full object-cover">
      <img src="/static/images/bedroom-1.jpg" alt="غرفة فندقية" loading="lazy" class="rounded-2xl h-56 w-full object-cover mt-8">
    </figure>
  </div>
</section>

<section id="categories-section" class="bg-sand/50 py-20">
  <div class="max-w-7xl mx-auto px-4">
    <h2 class="section-title text-3xl font-black text-charcoal mb-10">${esc(sec.categories?.title_ar || 'حلولنا وفئات منتجاتنا')}</h2>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${(categories.results as any[]).map((cat: any) => `
      <a href="/products?category=${esc(cat.slug)}" class="group relative rounded-2xl overflow-hidden h-56 fade-up">
        <img src="${esc(cat.image_url || '/static/images/hero-main.jpg')}" alt="${esc(cat.name_ar)}" loading="lazy" class="card-img w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-charcoal/85 to-transparent"></div>
        <div class="absolute bottom-0 right-0 p-5">
          <i class="fas ${esc(cat.icon || 'fa-couch')} text-gold text-xl mb-2"></i>
          <h3 class="text-white font-bold text-lg">${esc(cat.name_ar)}</h3>
          <span class="text-cream/70 text-xs">${cat.n} منتج</span>
        </div>
      </a>`).join('')}
    </div>
  </div>
</section>

${(featured.results as any[]).length ? `
<section id="featured-section" class="max-w-7xl mx-auto px-4 py-20">
  <div class="flex items-end justify-between mb-10">
    <h2 class="section-title text-3xl font-black text-charcoal">${esc(sec.featured?.title_ar || 'منتجات مميزة')}</h2>
    <a href="/products" class="text-gold font-bold text-sm hover:underline">عرض الكل <i class="fas fa-arrow-left mr-1"></i></a>
  </div>
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">${(featured.results as any[]).map(productCard).join('')}</div>
</section>` : ''}

<section id="services-section" class="bg-charcoal py-20">
  <div class="max-w-7xl mx-auto px-4">
    <h2 class="section-title text-3xl font-black text-white mb-10">${esc(sec.services?.title_ar || 'خدماتنا')}</h2>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${(services.results as any[]).map((s: any) => `
      <a href="/services#svc-${s.id}" class="bg-white/5 border border-white/10 rounded-2xl p-7 hover:border-gold/60 transition-colors fade-up block">
        <i class="fas ${esc(s.icon || 'fa-star')} text-gold text-2xl mb-4"></i>
        <h3 class="text-white font-bold text-lg mb-2">${esc(s.title_ar)}</h3>
        <p class="text-cream/60 text-sm leading-6">${esc(s.short_desc_ar || '')}</p>
      </a>`).join('')}
    </div>
  </div>
</section>

${(projects.results as any[]).length ? `
<section id="projects-section" class="max-w-7xl mx-auto px-4 py-20">
  <div class="flex items-end justify-between mb-10">
    <h2 class="section-title text-3xl font-black text-charcoal">${esc(sec.projects?.title_ar || 'مشاريعنا')}</h2>
    <a href="/projects" class="text-gold font-bold text-sm hover:underline">عرض الكل <i class="fas fa-arrow-left mr-1"></i></a>
  </div>
  <div class="grid md:grid-cols-3 gap-6">
    ${(projects.results as any[]).map((p: any) => `
    <a href="/projects/${esc(p.slug)}" class="group relative rounded-2xl overflow-hidden h-72 fade-up">
      <img src="${esc(p.cover_image || '/static/images/hero-main.jpg')}" alt="${esc(p.title_ar)}" loading="lazy" class="card-img w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-charcoal/85 to-transparent"></div>
      <div class="absolute bottom-0 right-0 p-6">
        <h3 class="text-white font-bold text-lg">${esc(p.title_ar)}</h3>
      </div>
    </a>`).join('')}
  </div>
</section>` : ''}

<section id="why-us-section" class="bg-sand/50 py-20">
  <div class="max-w-7xl mx-auto px-4">
    <h2 class="section-title text-3xl font-black text-charcoal mb-10">${esc(sec.why_us?.title_ar || 'لماذا سرايا الأندلس؟')}</h2>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      ${(whyUs.results as any[]).map((w: any) => `
      <article class="bg-white rounded-2xl p-7 text-center fade-up">
        <span class="w-14 h-14 mx-auto rounded-full bg-gold/10 text-gold flex items-center justify-center text-2xl mb-4"><i class="fas ${esc(w.icon || 'fa-check')}"></i></span>
        <h3 class="font-bold text-charcoal mb-2">${esc(w.title_ar)}</h3>
        <p class="text-sm text-brown/70 leading-6">${esc(w.description_ar || '')}</p>
      </article>`).join('')}
    </div>
  </div>
</section>

<section id="cta-section" class="max-w-5xl mx-auto px-4 py-20 text-center">
  <h2 class="text-3xl md:text-4xl font-black text-charcoal mb-4 fade-up">${esc(cta.title_ar || 'ابدأ مشروعك معنا')}</h2>
  <p class="text-brown/70 text-lg mb-8 fade-up">${esc(cta.content_ar || '')}</p>
  <a href="${esc(cta.cta_url || '/quote')}" class="btn-gold px-10 py-4 rounded-full font-bold text-lg fade-up inline-block">${esc(cta.cta_text_ar || 'اطلب عرض سعر')}</a>
</section>`

  return c.html(layout({ settings, path: '/' }, content))
})

// ---------- PRODUCTS LIST ----------
pages.get('/products', async (c) => {
  const db = c.env.DB
  const settings = await getSettings(db)
  const catSlug = c.req.query('category') || ''
  const q = c.req.query('q') || ''
  const cats = await db.prepare('SELECT slug, name_ar FROM categories WHERE is_active=1 ORDER BY sort_order').all()

  let sql = `SELECT p.*, c.name_ar category_name, c.slug category_slug FROM products p LEFT JOIN categories c ON c.id=p.category_id WHERE p.status='published'`
  const binds: any[] = []
  if (catSlug) { sql += ' AND c.slug = ?'; binds.push(catSlug) }
  if (q) { sql += ' AND (p.name_ar LIKE ? OR p.short_desc_ar LIKE ?)'; binds.push(`%${q}%`, `%${q}%`) }
  sql += ' ORDER BY p.is_featured DESC, p.updated_at DESC LIMIT 60'
  const products = await db.prepare(sql).bind(...binds).all()
  const activeCat = (cats.results as any[]).find((x: any) => x.slug === catSlug)

  const content = `
<section id="products-header" class="bg-charcoal py-16">
  <div class="max-w-7xl mx-auto px-4">
    <h1 class="text-4xl font-black text-white mb-3">${activeCat ? esc(activeCat.name_ar) : 'منتجاتنا'}</h1>
    <p class="text-cream/60">حلول أثاث فندقي وضيافة بجودة تليق بمشروعك</p>
  </div>
</section>
<section id="products-catalog" class="max-w-7xl mx-auto px-4 py-12">
  <div class="flex flex-wrap items-center gap-3 mb-10">
    <a href="/products" class="${!catSlug ? 'btn-gold' : 'btn-outline'} px-5 py-2 rounded-full text-sm font-bold">الكل</a>
    ${(cats.results as any[]).map((cat: any) => `<a href="/products?category=${esc(cat.slug)}" class="${catSlug === cat.slug ? 'btn-gold' : 'btn-outline'} px-5 py-2 rounded-full text-sm font-bold">${esc(cat.name_ar)}</a>`).join('')}
    <form action="/products" method="get" class="mr-auto flex">
      ${catSlug ? `<input type="hidden" name="category" value="${esc(catSlug)}">` : ''}
      <input id="search-input" name="q" value="${esc(q)}" placeholder="ابحث عن منتج..." class="border border-sand rounded-r-full px-4 py-2 text-sm bg-white focus:outline-none focus:border-gold">
      <button class="btn-gold rounded-l-full px-4" aria-label="بحث"><i class="fas fa-search"></i></button>
    </form>
  </div>
  ${(products.results as any[]).length
    ? `<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">${(products.results as any[]).map(productCard).join('')}</div>`
    : `<p class="text-center text-brown/60 py-20 text-lg">لا توجد منتجات مطابقة حالياً.</p>`}
</section>`

  return c.html(layout({ settings, path: '/products', title: activeCat ? activeCat.name_ar : 'المنتجات' }, content))
})

// ---------- PRODUCT DETAILS ----------
pages.get('/products/:slug', async (c) => {
  const db = c.env.DB
  const settings = await getSettings(db)
  const slug = c.req.param('slug')
  const p = await db.prepare(`SELECT p.*, c.name_ar category_name, c.slug category_slug FROM products p LEFT JOIN categories c ON c.id=p.category_id WHERE p.slug = ? AND p.status='published'`).bind(slug).first<any>()
  if (!p) return c.notFound()
  const images = await db.prepare('SELECT url FROM product_images WHERE product_id = ? ORDER BY sort_order').bind(p.id).all()
  const related = await db.prepare(`SELECT p.*, c.name_ar category_name FROM products p LEFT JOIN categories c ON c.id=p.category_id WHERE p.category_id = ? AND p.id != ? AND p.status='published' LIMIT 3`).bind(p.category_id, p.id).all()
  db.prepare('UPDATE products SET views = views + 1 WHERE id = ?').bind(p.id).run().catch(() => {})
  track(db, 'product_view', p.id, '/products/' + slug)

  const gallery = (images.results as any[]).map((i: any) => i.url)
  if (!gallery.length && p.main_image) gallery.push(p.main_image)
  const waMsg = (settings.whatsapp_product_message || 'مرحباً، أرغب في الاستفسار عن منتج: [PRODUCT]').replace('[PRODUCT]', p.name_ar)
  const wa = waLink(settings.whatsapp || '01227932213', waMsg)
  const features = nl2list(p.features_ar)
  let specs: any[] = []
  try { specs = p.specifications ? JSON.parse(p.specifications) : [] } catch {}

  const content = `
<nav id="breadcrumb" class="max-w-7xl mx-auto px-4 pt-6 text-sm text-brown/60">
  <a href="/" class="hover:text-gold">الرئيسية</a> / <a href="/products" class="hover:text-gold">المنتجات</a>
  ${p.category_name ? ` / <a href="/products?category=${esc(p.category_slug)}" class="hover:text-gold">${esc(p.category_name)}</a>` : ''}
  / <span class="text-charcoal">${esc(p.name_ar)}</span>
</nav>
<section id="product-details" class="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-2 gap-12">
  <div>
    <figure class="rounded-2xl overflow-hidden h-[420px] bg-sand">
      <img id="main-product-image" src="${esc(gallery[0] || '/static/images/hero-main.jpg')}" alt="${esc(p.name_ar)}" class="w-full h-full object-cover">
    </figure>
    ${gallery.length > 1 ? `
    <div id="product-gallery" class="grid grid-cols-4 gap-3 mt-4">
      ${gallery.map((u: string, i: number) => `<button onclick="document.getElementById('main-product-image').src='${esc(u)}'" class="rounded-xl overflow-hidden h-20 border-2 ${i === 0 ? 'border-gold' : 'border-transparent'} hover:border-gold transition-colors"><img src="${esc(u)}" alt="" loading="lazy" class="w-full h-full object-cover"></button>`).join('')}
    </div>` : ''}
  </div>
  <div>
    ${p.category_name ? `<span class="text-gold text-sm font-bold">${esc(p.category_name)}</span>` : ''}
    <h1 class="text-3xl md:text-4xl font-black text-charcoal mt-2 mb-4">${esc(p.name_ar)}</h1>
    <div class="flex gap-2 mb-5">
      ${p.is_new ? '<span class="bg-gold text-white text-xs font-bold px-3 py-1 rounded-full">جديد</span>' : ''}
      ${p.is_featured ? '<span class="bg-charcoal text-white text-xs font-bold px-3 py-1 rounded-full">مميز</span>' : ''}
      ${p.is_offer ? '<span class="bg-brown text-white text-xs font-bold px-3 py-1 rounded-full">عرض خاص</span>' : ''}
    </div>
    <p class="text-brown/80 leading-8 mb-6">${esc(p.description_ar || p.short_desc_ar || '')}</p>
    ${features.length ? `<ul class="space-y-2 mb-6">${features.map(f => `<li class="flex items-center gap-2 text-sm"><i class="fas fa-check text-gold"></i>${esc(f)}</li>`).join('')}</ul>` : ''}
    <dl class="bg-white rounded-2xl p-6 space-y-3 text-sm mb-8">
      ${p.materials_ar ? `<div class="flex justify-between"><dt class="text-brown/60">الخامات</dt><dd class="font-semibold">${esc(p.materials_ar)}</dd></div>` : ''}
      ${p.dimensions ? `<div class="flex justify-between"><dt class="text-brown/60">الأبعاد</dt><dd class="font-semibold">${esc(p.dimensions)}</dd></div>` : ''}
      ${p.sku ? `<div class="flex justify-between"><dt class="text-brown/60">SKU</dt><dd class="font-semibold" dir="ltr">${esc(p.sku)}</dd></div>` : ''}
      ${specs.map((sp: any) => `<div class="flex justify-between"><dt class="text-brown/60">${esc(sp.label_ar || '')}</dt><dd class="font-semibold">${esc(sp.value_ar || '')}</dd></div>`).join('')}
      ${p.show_price && p.price ? `<div class="flex justify-between border-t border-sand pt-3"><dt class="text-brown/60">السعر</dt><dd class="font-black text-gold text-lg">${esc(String(p.price))} ج.م</dd></div>` : ''}
    </dl>
    <div class="flex flex-wrap gap-4">
      <a href="/quote?product=${esc(p.slug)}&name=${encodeURIComponent(p.name_ar)}" class="btn-gold px-8 py-3.5 rounded-full font-bold">اطلب عرض سعر لهذا المنتج</a>
      <a href="${wa}" target="_blank" rel="noopener" onclick="trackEvent('whatsapp_click', ${p.id})" class="bg-[#25D366] text-white px-8 py-3.5 rounded-full font-bold"><i class="fab fa-whatsapp ml-2"></i>استفسر واتساب</a>
    </div>
  </div>
</section>
${(related.results as any[]).length ? `
<section id="related-products" class="max-w-7xl mx-auto px-4 py-14">
  <h2 class="section-title text-2xl font-black text-charcoal mb-8">منتجات ذات صلة</h2>
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">${(related.results as any[]).map(productCard).join('')}</div>
</section>` : ''}`

  return c.html(layout({ settings, path: '/products', title: p.seo_title || p.name_ar, description: p.seo_description || p.short_desc_ar || '', ogImage: p.og_image || p.main_image }, content))
})

// ---------- SERVICES ----------
pages.get('/services', async (c) => {
  const db = c.env.DB
  const settings = await getSettings(db)
  const services = await db.prepare('SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order').all()
  const content = `
<section id="services-header" class="bg-charcoal py-16">
  <div class="max-w-7xl mx-auto px-4">
    <h1 class="text-4xl font-black text-white mb-3">خدماتنا</h1>
    <p class="text-cream/60">حلول متكاملة لتجهيز المشروعات الفندقية والضيافة</p>
  </div>
</section>
<section id="services-list" class="max-w-7xl mx-auto px-4 py-14 space-y-12">
  ${(services.results as any[]).map((s: any, i: number) => `
  <article id="svc-${s.id}" class="grid md:grid-cols-2 gap-10 items-center fade-up">
    <figure class="rounded-2xl overflow-hidden h-72 ${i % 2 ? 'md:order-2' : ''}">
      <img src="${esc(s.image_url || '/static/images/hero-main.jpg')}" alt="${esc(s.title_ar)}" loading="lazy" class="w-full h-full object-cover">
    </figure>
    <div>
      <i class="fas ${esc(s.icon || 'fa-star')} text-gold text-3xl mb-4"></i>
      <h2 class="text-2xl font-black text-charcoal mb-4">${esc(s.title_ar)}</h2>
      <p class="text-brown/80 leading-8 mb-5">${esc(s.description_ar || s.short_desc_ar || '')}</p>
      ${nl2list(s.features_ar).map(f => `<p class="text-sm mb-1"><i class="fas fa-check text-gold ml-2"></i>${esc(f)}</p>`).join('')}
      <a href="/quote" class="btn-outline inline-block mt-5 px-7 py-2.5 rounded-full font-bold text-sm">اطلب هذه الخدمة</a>
    </div>
  </article>`).join('')}
</section>`
  return c.html(layout({ settings, path: '/services', title: 'الخدمات' }, content))
})

// ---------- PROJECTS ----------
pages.get('/projects', async (c) => {
  const db = c.env.DB
  const settings = await getSettings(db)
  const projects = await db.prepare(`SELECT * FROM projects WHERE status='published' ORDER BY is_featured DESC, created_at DESC`).all()
  const content = `
<section id="projects-header" class="bg-charcoal py-16">
  <div class="max-w-7xl mx-auto px-4">
    <h1 class="text-4xl font-black text-white mb-3">مشاريعنا</h1>
    <p class="text-cream/60">نماذج من أعمال التجهيز والتوريد للمشروعات الفندقية</p>
  </div>
</section>
<section id="projects-grid" class="max-w-7xl mx-auto px-4 py-14">
  ${(projects.results as any[]).length ? `
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    ${(projects.results as any[]).map((p: any) => `
    <a href="/projects/${esc(p.slug)}" class="group relative rounded-2xl overflow-hidden h-80 fade-up">
      <img src="${esc(p.cover_image || '/static/images/hero-main.jpg')}" alt="${esc(p.title_ar)}" loading="lazy" class="card-img w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-charcoal/90 to-transparent"></div>
      <div class="absolute bottom-0 right-0 p-6">
        ${p.project_type ? `<span class="text-gold text-xs font-bold">${esc(p.project_type)}</span>` : ''}
        <h2 class="text-white font-bold text-xl mt-1">${esc(p.title_ar)}</h2>
        ${p.location ? `<p class="text-cream/60 text-sm mt-1"><i class="fas fa-location-dot ml-1"></i>${esc(p.location)}</p>` : ''}
      </div>
    </a>`).join('')}
  </div>` : '<p class="text-center text-brown/60 py-20">سيتم إضافة المشاريع قريباً.</p>'}
</section>`
  return c.html(layout({ settings, path: '/projects', title: 'المشاريع' }, content))
})

pages.get('/projects/:slug', async (c) => {
  const db = c.env.DB
  const settings = await getSettings(db)
  const p = await db.prepare(`SELECT * FROM projects WHERE slug = ? AND status='published'`).bind(c.req.param('slug')).first<any>()
  if (!p) return c.notFound()
  const images = await db.prepare('SELECT url, caption_ar FROM project_images WHERE project_id = ? ORDER BY sort_order').bind(p.id).all()
  const content = `
<section id="project-header" class="relative h-[50vh] min-h-[360px]">
  <img src="${esc(p.cover_image || '/static/images/hero-main.jpg')}" alt="${esc(p.title_ar)}" class="absolute inset-0 w-full h-full object-cover">
  <div class="absolute inset-0 bg-charcoal/60"></div>
  <div class="relative max-w-7xl mx-auto px-4 h-full flex items-end pb-10">
    <div>
      ${p.project_type ? `<span class="text-gold text-sm font-bold">${esc(p.project_type)}</span>` : ''}
      <h1 class="text-4xl font-black text-white mt-2">${esc(p.title_ar)}</h1>
    </div>
  </div>
</section>
<section id="project-body" class="max-w-5xl mx-auto px-4 py-14">
  <p class="text-brown/80 leading-9 text-lg mb-10">${esc(p.description_ar || '')}</p>
  <div class="grid sm:grid-cols-2 gap-5">
    ${(images.results as any[]).map((im: any) => `<figure class="rounded-2xl overflow-hidden fade-up"><img src="${esc(im.url)}" alt="${esc(im.caption_ar || p.title_ar)}" loading="lazy" class="w-full h-72 object-cover"></figure>`).join('')}
  </div>
  <div class="text-center mt-12"><a href="/quote" class="btn-gold px-10 py-4 rounded-full font-bold inline-block">ابدأ مشروعك معنا</a></div>
</section>`
  return c.html(layout({ settings, path: '/projects', title: p.title_ar, ogImage: p.cover_image }, content))
})

// ---------- ABOUT ----------
pages.get('/about', async (c) => {
  const db = c.env.DB
  const settings = await getSettings(db)
  const whyUs = await db.prepare('SELECT * FROM why_us_points WHERE is_active = 1 ORDER BY sort_order').all()
  const content = `
<section id="about-header" class="bg-charcoal py-16">
  <div class="max-w-7xl mx-auto px-4">
    <h1 class="text-4xl font-black text-white mb-3">من نحن</h1>
  </div>
</section>
<section id="about-body" class="max-w-7xl mx-auto px-4 py-14 grid md:grid-cols-2 gap-12 items-center">
  <div class="fade-up">
    <h2 class="section-title text-2xl font-black text-charcoal mb-6">${esc(settings.company_name_ar || '')}</h2>
    <p class="text-brown/80 leading-9 text-lg">${esc(settings.footer_about_ar || '')}</p>
    <p class="text-brown/80 leading-9 text-lg mt-4">نتعامل مع أصحاب الفنادق والشقق الفندقية والمنتجعات والمطاعم والكافيهات، ونوفر حلول تصميم وتوريد وتجهيز حسب احتياج كل مشروع — من قطعة أثاث واحدة إلى تجهيز متكامل.</p>
    <a href="/quote" class="btn-gold inline-block mt-8 px-8 py-3.5 rounded-full font-bold">اطلب عرض سعر</a>
  </div>
  <figure class="grid grid-cols-2 gap-4 fade-up">
    <img src="/static/images/bedroom-4.jpg" alt="" loading="lazy" class="rounded-2xl h-60 w-full object-cover">
    <img src="/static/images/dining-1.jpg" alt="" loading="lazy" class="rounded-2xl h-60 w-full object-cover mt-8">
  </figure>
</section>
<section id="about-values" class="bg-sand/50 py-16">
  <div class="max-w-7xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
    ${(whyUs.results as any[]).map((w: any) => `
    <article class="bg-white rounded-2xl p-7 text-center fade-up">
      <span class="w-14 h-14 mx-auto rounded-full bg-gold/10 text-gold flex items-center justify-center text-2xl mb-4"><i class="fas ${esc(w.icon || 'fa-check')}"></i></span>
      <h3 class="font-bold text-charcoal mb-2">${esc(w.title_ar)}</h3>
      <p class="text-sm text-brown/70 leading-6">${esc(w.description_ar || '')}</p>
    </article>`).join('')}
  </div>
</section>`
  return c.html(layout({ settings, path: '/about', title: 'من نحن' }, content))
})

// ---------- QUOTE ----------
pages.get('/quote', async (c) => {
  const db = c.env.DB
  const settings = await getSettings(db)
  const preName = c.req.query('name') || ''
  const products = await db.prepare(`SELECT id, name_ar FROM products WHERE status='published' ORDER BY name_ar`).all()
  const content = `
<section id="quote-header" class="bg-charcoal py-16">
  <div class="max-w-7xl mx-auto px-4">
    <h1 class="text-4xl font-black text-white mb-3">طلب عرض سعر</h1>
    <p class="text-cream/60">أخبرنا عن مشروعك وسنتواصل معك بعرض سعر مخصص</p>
  </div>
</section>
<section id="quote-form-section" class="max-w-3xl mx-auto px-4 py-14">
  <form id="quote-form" class="bg-white rounded-2xl p-8 shadow-sm space-y-5">
    <div class="grid sm:grid-cols-2 gap-5">
      <div><label class="block text-sm font-bold mb-2">الاسم *</label><input name="name" required class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></div>
      <div><label class="block text-sm font-bold mb-2">الشركة / المنشأة</label><input name="company" class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></div>
      <div><label class="block text-sm font-bold mb-2">الهاتف *</label><input name="phone" required dir="ltr" class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></div>
      <div><label class="block text-sm font-bold mb-2">WhatsApp</label><input name="whatsapp" dir="ltr" class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></div>
      <div><label class="block text-sm font-bold mb-2">البريد الإلكتروني (اختياري)</label><input name="email" type="email" dir="ltr" class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></div>
      <div><label class="block text-sm font-bold mb-2">نوع المشروع</label>
        <select name="project_type" class="w-full border border-sand rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-gold">
          <option value="">اختر...</option><option value="hotel">فندق</option><option value="hotel_apartments">شقق فندقية</option>
          <option value="resort">منتجع</option><option value="restaurant">مطعم</option><option value="cafe">كافيه</option>
          <option value="commercial">منشأة تجارية</option><option value="other">أخرى</option>
        </select></div>
      <div><label class="block text-sm font-bold mb-2">المدينة</label><input name="city" class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></div>
      <div><label class="block text-sm font-bold mb-2">عدد الوحدات / الغرف (اختياري)</label><input name="units_count" class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></div>
    </div>
    <div><label class="block text-sm font-bold mb-2">المنتجات المطلوبة</label>
      <select id="products-select" name="products" multiple size="5" class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold">
        ${(products.results as any[]).map((p: any) => `<option value="${p.id}" data-name="${esc(p.name_ar)}" ${preName && p.name_ar === preName ? 'selected' : ''}>${esc(p.name_ar)}</option>`).join('')}
      </select>
      <p class="text-xs text-brown/50 mt-1">يمكنك اختيار أكثر من منتج (Ctrl / لمس مطول)</p></div>
    <div><label class="block text-sm font-bold mb-2">تفاصيل الطلب</label><textarea name="message" rows="4" class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></textarea></div>
    <button id="quote-submit-btn" type="submit" class="btn-gold w-full py-4 rounded-xl font-bold text-lg">إرسال طلب عرض السعر</button>
    <div id="quote-result" class="hidden text-center p-5 rounded-xl"></div>
  </form>
</section>
<script>
document.getElementById('quote-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target, btn = document.getElementById('quote-submit-btn'), out = document.getElementById('quote-result');
  const sel = [...document.getElementById('products-select').selectedOptions].map(o => ({ id: +o.value, name: o.dataset.name }));
  const data = { name: f.name.value, company: f.company.value, phone: f.phone.value, whatsapp: f.whatsapp.value,
    email: f.email.value, project_type: f.project_type.value, city: f.city.value, units_count: f.units_count.value,
    products_requested: sel, message: f.message.value };
  btn.disabled = true; btn.textContent = 'جارٍ الإرسال...';
  try {
    const r = await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const j = await r.json();
    out.classList.remove('hidden');
    if (r.ok) { out.className = 'text-center p-5 rounded-xl bg-green-50 text-green-800'; out.innerHTML = '<i class="fas fa-check-circle text-2xl mb-2"></i><p class="font-bold">تم استلام طلبك بنجاح!</p><p class="text-sm mt-1">رقم الطلب: <b dir="ltr">' + j.request_ref + '</b> — سنتواصل معك قريباً.</p>'; f.reset(); }
    else { out.className = 'text-center p-5 rounded-xl bg-red-50 text-red-700'; out.textContent = j.error || 'حدث خطأ، حاول مرة أخرى'; }
  } catch { out.classList.remove('hidden'); out.className = 'text-center p-5 rounded-xl bg-red-50 text-red-700'; out.textContent = 'تعذر الاتصال بالخادم'; }
  btn.disabled = false; btn.textContent = 'إرسال طلب عرض السعر';
});
</script>`
  return c.html(layout({ settings, path: '/quote', title: 'طلب عرض سعر' }, content))
})

// ---------- CONTACT ----------
pages.get('/contact', async (c) => {
  const db = c.env.DB
  const settings = await getSettings(db)
  const wa = waLink(settings.whatsapp || '01227932213', settings.whatsapp_default_message || '')
  const content = `
<section id="contact-header" class="bg-charcoal py-16">
  <div class="max-w-7xl mx-auto px-4"><h1 class="text-4xl font-black text-white mb-3">تواصل معنا</h1></div>
</section>
<section id="contact-body" class="max-w-7xl mx-auto px-4 py-14 grid lg:grid-cols-2 gap-12">
  <div class="space-y-5">
    <article class="bg-white rounded-2xl p-6 flex items-center gap-5">
      <span class="w-14 h-14 rounded-full bg-gold/10 text-gold flex items-center justify-center text-2xl"><i class="fas fa-phone"></i></span>
      <div><h3 class="font-bold">الهاتف</h3><a href="tel:${esc((settings.phone||'').replace(/\s/g,''))}" onclick="trackEvent('phone_click')" dir="ltr" class="text-brown/70">${esc(settings.phone || '')}</a></div>
    </article>
    <article class="bg-white rounded-2xl p-6 flex items-center gap-5">
      <span class="w-14 h-14 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center text-2xl"><i class="fab fa-whatsapp"></i></span>
      <div><h3 class="font-bold">WhatsApp</h3><a href="${wa}" target="_blank" rel="noopener" onclick="trackEvent('whatsapp_click')" dir="ltr" class="text-brown/70">${esc(settings.whatsapp || '')}</a></div>
    </article>
    <article class="bg-white rounded-2xl p-6 flex items-center gap-5">
      <span class="w-14 h-14 rounded-full bg-gold/10 text-gold flex items-center justify-center text-2xl"><i class="fas fa-location-dot"></i></span>
      <div><h3 class="font-bold">العنوان</h3><p class="text-brown/70">${esc(settings.address_ar || '')}</p></div>
    </article>
  </div>
  <form id="contact-form" class="bg-white rounded-2xl p-8 shadow-sm space-y-5">
    <h2 class="text-xl font-black text-charcoal">أرسل رسالة</h2>
    <div><label class="block text-sm font-bold mb-2">الاسم *</label><input name="name" required class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></div>
    <div><label class="block text-sm font-bold mb-2">الهاتف *</label><input name="phone" required dir="ltr" class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></div>
    <div><label class="block text-sm font-bold mb-2">البريد الإلكتروني</label><input name="email" type="email" dir="ltr" class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></div>
    <div><label class="block text-sm font-bold mb-2">الرسالة *</label><textarea name="message" rows="4" required class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></textarea></div>
    <button id="contact-submit-btn" type="submit" class="btn-gold w-full py-3.5 rounded-xl font-bold">إرسال</button>
    <div id="contact-result" class="hidden text-center p-4 rounded-xl"></div>
  </form>
</section>
<script>
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target, btn = document.getElementById('contact-submit-btn'), out = document.getElementById('contact-result');
  btn.disabled = true;
  try {
    const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: f.name.value, phone: f.phone.value, email: f.email.value, message: f.message.value }) });
    const j = await r.json();
    out.classList.remove('hidden');
    if (r.ok) { out.className = 'text-center p-4 rounded-xl bg-green-50 text-green-800 font-bold'; out.textContent = 'تم إرسال رسالتك بنجاح — سنتواصل معك قريباً.'; f.reset(); }
    else { out.className = 'text-center p-4 rounded-xl bg-red-50 text-red-700'; out.textContent = j.error || 'حدث خطأ'; }
  } catch { out.classList.remove('hidden'); out.className='text-center p-4 rounded-xl bg-red-50 text-red-700'; out.textContent='تعذر الاتصال'; }
  btn.disabled = false;
});
</script>`
  return c.html(layout({ settings, path: '/contact', title: 'تواصل معنا' }, content))
})

export default pages
