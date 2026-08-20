// ENG-006 — Public site layout (AR RTL primary) + premium hospitality identity
import { esc, waLink } from '../lib/helpers'

export type SiteCtx = {
  settings: Record<string, string>
  path: string
  title?: string
  description?: string
  ogImage?: string
}

export function layout(ctx: SiteCtx, content: string): string {
  const s = ctx.settings
  const companyName = s.company_name_ar || 'سرايا الأندلس للأثاث الفندقي والضيافة'
  const title = ctx.title ? `${ctx.title} — ${companyName}` : (s.seo_default_title || companyName)
  const desc = ctx.description || s.seo_default_description || ''
  const wa = waLink(s.whatsapp || '01227932213', s.whatsapp_default_message || '')
  const nav = [
    ['/', 'الرئيسية'],
    ['/products', 'المنتجات'],
    ['/services', 'الخدمات'],
    ['/projects', 'المشاريع'],
    ['/about', 'من نحن'],
    ['/contact', 'تواصل معنا'],
  ]
  const navHtml = nav.map(([href, label]) => {
    const active = ctx.path === href || (href !== '/' && ctx.path.startsWith(href as string))
    return `<a href="${href}" class="nav-link ${active ? 'nav-active' : ''}">${label}</a>`
  }).join('')

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
${ctx.ogImage ? `<meta property="og:image" content="${esc(ctx.ogImage)}">` : ''}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Amiri:wght@400;700&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<script>
tailwind.config = { theme: { extend: {
  colors: {
    charcoal: '#23201c', cream: '#faf7f2', sand: '#efe9df', gold: '#b08d57', golddark: '#8f7040', brown: '#4a3728'
  },
  fontFamily: { sans: ['Cairo','sans-serif'], serif: ['Amiri','serif'] }
}}}
</script>
<style>
  body { font-family: 'Cairo', sans-serif; background:#faf7f2; color:#23201c; }
  .nav-link { color:#4a3728; padding:.5rem .75rem; font-weight:600; font-size:.95rem; transition:color .2s; }
  .nav-link:hover, .nav-active { color:#b08d57; }
  .btn-gold { background:#b08d57; color:#fff; transition:background .2s; }
  .btn-gold:hover { background:#8f7040; }
  .btn-outline { border:1px solid #b08d57; color:#b08d57; transition:all .2s; }
  .btn-outline:hover { background:#b08d57; color:#fff; }
  .section-title { position:relative; }
  .section-title:after { content:''; display:block; width:64px; height:3px; background:#b08d57; margin-top:.75rem; }
  .card-img { transition: transform .5s ease; }
  .group:hover .card-img { transform: scale(1.05); }
  .fade-up { opacity:0; transform:translateY(24px); transition:opacity .6s ease, transform .6s ease; }
  .fade-up.visible { opacity:1; transform:none; }
</style>
</head>
<body>
<header id="site-header" class="bg-cream/95 backdrop-blur sticky top-0 z-40 border-b border-sand">
  <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
    <a href="/" id="brand-logo" class="flex items-center gap-3">
      <span class="w-11 h-11 rounded-full bg-charcoal text-gold flex items-center justify-center text-xl"><i class="fas fa-couch"></i></span>
      <span class="leading-tight">
        <span class="block font-black text-lg text-charcoal">سرايا الأندلس</span>
        <span class="block text-xs text-brown/70 tracking-wide">للأثاث الفندقي والضيافة</span>
      </span>
    </a>
    <nav id="main-nav" class="hidden lg:flex items-center">${navHtml}</nav>
    <div class="flex items-center gap-3">
      <a href="/quote" class="btn-gold hidden sm:inline-block px-5 py-2.5 rounded-full text-sm font-bold">اطلب عرض سعر</a>
      <a href="${wa}" target="_blank" rel="noopener" onclick="trackEvent('whatsapp_click')" class="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center text-lg" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
      <button id="menu-btn" class="lg:hidden w-10 h-10 text-charcoal text-xl" aria-label="القائمة"><i class="fas fa-bars"></i></button>
    </div>
  </div>
  <nav id="mobile-nav" class="hidden lg:hidden border-t border-sand bg-cream px-4 py-3 flex flex-col">${navHtml}
    <a href="/quote" class="btn-gold mt-2 px-5 py-2.5 rounded-full text-sm font-bold text-center">اطلب عرض سعر</a>
  </nav>
</header>

<main id="page-content">${content}</main>

<footer id="site-footer" class="bg-charcoal text-cream/80 mt-20">
  <div class="max-w-7xl mx-auto px-4 py-14 grid md:grid-cols-3 gap-10">
    <section>
      <h3 class="text-gold font-bold text-lg mb-4">${esc(companyName)}</h3>
      <p class="text-sm leading-7">${esc(s.footer_about_ar || '')}</p>
    </section>
    <section>
      <h3 class="text-gold font-bold text-lg mb-4">روابط سريعة</h3>
      <ul class="space-y-2 text-sm">
        ${nav.map(([href, label]) => `<li><a href="${href}" class="hover:text-gold transition-colors">${label}</a></li>`).join('')}
        <li><a href="/quote" class="hover:text-gold transition-colors">طلب عرض سعر</a></li>
      </ul>
    </section>
    <section>
      <h3 class="text-gold font-bold text-lg mb-4">تواصل معنا</h3>
      <ul class="space-y-3 text-sm">
        <li><i class="fas fa-phone ml-2 text-gold"></i><a href="tel:${esc((s.phone||'').replace(/\s/g,''))}" onclick="trackEvent('phone_click')" dir="ltr">${esc(s.phone || '')}</a></li>
        <li><i class="fab fa-whatsapp ml-2 text-gold"></i><a href="${wa}" target="_blank" rel="noopener" onclick="trackEvent('whatsapp_click')" dir="ltr">${esc(s.whatsapp || '')}</a></li>
        <li><i class="fas fa-location-dot ml-2 text-gold"></i>${esc(s.address_ar || '')}</li>
      </ul>
    </section>
  </div>
  <div class="border-t border-white/10 py-4 text-center text-xs text-cream/50">© ${new Date().getFullYear()} ${esc(companyName)} — جميع الحقوق محفوظة</div>
</footer>

<a href="${wa}" target="_blank" rel="noopener" onclick="trackEvent('whatsapp_click')" id="wa-float" class="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center text-2xl shadow-lg hover:scale-110 transition-transform" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>

<script>
document.getElementById('menu-btn').addEventListener('click', () => document.getElementById('mobile-nav').classList.toggle('hidden'));
function trackEvent(ev, id) { try { navigator.sendBeacon('/api/track', JSON.stringify({ event: ev, entity_id: id||null, path: location.pathname })); } catch(e){} }
trackEvent('page_view');
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('visible')), { threshold:.12 });
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
</script>
</body>
</html>`
}
