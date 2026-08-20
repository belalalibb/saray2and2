// SSR page rendering helpers (Arabic RTL)
export function esc(s: any): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function nl2li(s: any): string {
  return String(s ?? '').split('\n').map(x => x.trim()).filter(Boolean)
    .map(x => `<li class="flex items-start gap-2"><i class="fas fa-check text-gold mt-1"></i><span>${esc(x)}</span></li>`).join('')
}

export function waLink(number: string, message: string): string {
  return `https://wa.me/${(number || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message || '')}`
}

export function layout(opts: { title: string; description?: string; settings: Record<string, string>; body: string; active?: string }): string {
  const s = opts.settings
  const wa = waLink(s.whatsapp, s.whatsapp_default_message)
  const nav = [
    ['/', 'الرئيسية', 'home'],
    ['/products', 'المنتجات', 'products'],
    ['/services', 'الخدمات', 'services'],
    ['/projects', 'مشاريعنا', 'projects'],
    ['/contact', 'تواصل معنا', 'contact'],
  ]
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(opts.title)}</title>
<meta name="description" content="${esc(opts.description || s.seo_default_description || '')}">
<script src="https://cdn.tailwindcss.com"></script>
<script>tailwind.config={theme:{extend:{colors:{gold:'#C6A15B',golddark:'#A8863F',charcoal:'#2B2420',brown:'#4A3F35',sand:'#EDE6DA',cream:'#F8F4EC'},fontFamily:{sans:['Tajawal','sans-serif']}}}}</script>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<link href="/static/style.css" rel="stylesheet">
</head>
<body class="bg-cream text-brown font-sans">
<header class="bg-charcoal text-white sticky top-0 z-40 shadow-lg">
  <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
    <a href="/" id="site-logo" class="text-xl font-black text-gold"><i class="fas fa-couch ml-2"></i>${esc(s.company_name_ar || 'الأثاث الفاخر')}</a>
    <nav id="main-nav" class="hidden md:flex items-center gap-6 text-sm font-semibold">
      ${nav.map(([href, label, key]) => `<a href="${href}" class="${opts.active === key ? 'text-gold' : 'hover:text-gold'} transition">${label}</a>`).join('')}
    </nav>
    <div class="flex items-center gap-3">
      <a href="${wa}" target="_blank" class="hidden sm:inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-sm font-bold transition"><i class="fab fa-whatsapp"></i>واتساب</a>
      <button id="mobile-menu-btn" class="md:hidden text-2xl" aria-label="القائمة"><i class="fas fa-bars"></i></button>
    </div>
  </div>
  <nav id="mobile-nav" class="hidden md:hidden bg-charcoal border-t border-white/10 px-4 py-3 space-y-2">
    ${nav.map(([href, label]) => `<a href="${href}" class="block py-2 font-semibold hover:text-gold">${label}</a>`).join('')}
  </nav>
</header>
<main>${opts.body}</main>
<footer class="bg-charcoal text-white/80 mt-16">
  <div class="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
    <section>
      <h3 class="text-gold font-black text-lg mb-3">${esc(s.company_name_ar || '')}</h3>
      <p class="text-sm leading-relaxed">${esc(s.footer_about_ar || '')}</p>
    </section>
    <section>
      <h3 class="text-gold font-black text-lg mb-3">روابط سريعة</h3>
      <ul class="space-y-2 text-sm">
        ${nav.map(([href, label]) => `<li><a href="${href}" class="hover:text-gold">${label}</a></li>`).join('')}
      </ul>
    </section>
    <section>
      <h3 class="text-gold font-black text-lg mb-3">تواصل معنا</h3>
      <ul class="space-y-2 text-sm">
        <li><i class="fas fa-phone ml-2 text-gold"></i><span dir="ltr">${esc(s.phone || '')}</span></li>
        <li><i class="fab fa-whatsapp ml-2 text-gold"></i><span dir="ltr">${esc(s.whatsapp || '')}</span></li>
        <li><i class="fas fa-location-dot ml-2 text-gold"></i>${esc(s.address_ar || '')}</li>
      </ul>
    </section>
  </div>
  <div class="border-t border-white/10 text-center py-4 text-xs">© ${new Date().getFullYear()} ${esc(s.company_name_ar || '')} — جميع الحقوق محفوظة</div>
</footer>
<a href="${wa}" target="_blank" id="wa-float" class="fixed bottom-5 left-5 z-50 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center text-2xl shadow-2xl transition" aria-label="واتساب"><i class="fab fa-whatsapp"></i></a>
<script>
document.getElementById('mobile-menu-btn').addEventListener('click',()=>document.getElementById('mobile-nav').classList.toggle('hidden'));
</script>
</body>
</html>`
}

export function productCard(p: any, s: Record<string, string>): string {
  const waMsg = (s.whatsapp_product_message || '[PRODUCT]').replace('[PRODUCT]', p.name_ar)
  return `<article class="product-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group">
    <a href="/products/${esc(p.slug)}" class="block relative">
      <img src="${esc(p.main_image || '/static/images/hero-main.jpg')}" alt="${esc(p.name_ar)}" class="w-full h-52 object-cover group-hover:scale-105 transition duration-500" loading="lazy">
      <div class="absolute top-3 right-3 flex gap-1.5">
        ${p.is_new ? '<span class="bg-gold text-white text-[11px] font-bold px-2.5 py-1 rounded-full">جديد</span>' : ''}
        ${p.is_offer ? '<span class="bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">عرض</span>' : ''}
      </div>
    </a>
    <div class="p-4">
      <p class="text-xs text-gold font-bold mb-1">${esc(p.category_name || '')}</p>
      <h3 class="font-bold text-charcoal mb-1"><a href="/products/${esc(p.slug)}" class="hover:text-gold transition">${esc(p.name_ar)}</a></h3>
      <p class="text-xs text-brown/60 mb-3 line-clamp-2">${esc(p.short_desc_ar || '')}</p>
      ${p.show_price && p.price ? `<p class="font-black text-gold mb-3">${Number(p.price).toLocaleString('ar-SA')} ر.س</p>` : ''}
      <div class="flex gap-2">
        <a href="/products/${esc(p.slug)}" class="flex-1 text-center bg-charcoal text-white text-sm font-bold py-2 rounded-xl hover:bg-gold transition">التفاصيل</a>
        <a href="${waLink(s.whatsapp, waMsg)}" target="_blank" class="w-10 h-9 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center transition" aria-label="استفسار واتساب"><i class="fab fa-whatsapp"></i></a>
      </div>
    </div>
  </article>`
}
