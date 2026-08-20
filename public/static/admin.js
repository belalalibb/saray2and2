// ENG-012→019 — Admin SPA (vanilla JS + axios) — سرايا الأندلس
/* global axios */
(() => {
const app = document.getElementById('admin-app');
const S = { user: null, view: 'dashboard', cache: {} };
const api = axios.create({ baseURL: '/api' });
api.interceptors.response.use(r => r, e => {
  if (e.response && e.response.status === 401 && S.user) { S.user = null; renderLogin(); }
  return Promise.reject(e);
});
const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const errMsg = e => (e.response && e.response.data && e.response.data.error) || 'حدث خطأ غير متوقع';
const fmtDate = d => d ? new Date(d.replace(' ', 'T') + (d.includes('Z') ? '' : 'Z')).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
function toast(msg, ok = true) {
  const t = document.createElement('div');
  t.className = `fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl text-white font-bold text-sm shadow-lg ${ok ? 'bg-green-600' : 'bg-red-600'}`;
  t.textContent = msg; document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}
function modal(html) {
  const m = document.createElement('div');
  m.className = 'fixed inset-0 z-50 modal-bg flex items-start justify-center overflow-y-auto py-10 px-4';
  m.innerHTML = `<div class="bg-white rounded-2xl w-full max-w-2xl p-7 relative">
    <button class="absolute top-4 left-4 text-brown/50 hover:text-brown text-lg" data-close><i class="fas fa-xmark"></i></button>${html}</div>`;
  m.addEventListener('click', e => { if (e.target === m || e.target.closest('[data-close]')) m.remove(); });
  document.body.appendChild(m);
  return m;
}
const ROLE_LABELS = { super_admin: 'مدير عام', content_manager: 'مدير محتوى', sales: 'مبيعات', editor: 'محرر' };
const LEAD_STATUS = {
  new: ['جديد', 'bg-blue-100 text-blue-800'], contacted: ['تم التواصل', 'bg-cyan-100 text-cyan-800'],
  qualified: ['مؤهل', 'bg-indigo-100 text-indigo-800'], quotation_sent: ['أُرسل العرض', 'bg-purple-100 text-purple-800'],
  negotiation: ['تفاوض', 'bg-amber-100 text-amber-800'], won: ['تم الكسب', 'bg-green-100 text-green-800'],
  lost: ['خسارة', 'bg-red-100 text-red-700'], archived: ['مؤرشف', 'bg-gray-100 text-gray-600']
};
const leadBadge = st => { const [l, cls] = LEAD_STATUS[st] || [st, 'bg-gray-100']; return `<span class="badge ${cls}">${l}</span>`; };

// ---------- LOGIN ----------
function renderLogin() {
  app.innerHTML = `
  <div class="min-h-screen flex items-center justify-center px-4" style="background:linear-gradient(135deg,#23201c,#4a3728)">
    <form id="login-form" class="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl">
      <div class="text-center mb-8">
        <span class="w-16 h-16 mx-auto rounded-full bg-charcoal text-gold flex items-center justify-center text-2xl mb-4"><i class="fas fa-couch"></i></span>
        <h1 class="text-2xl font-black text-charcoal">سرايا الأندلس</h1>
        <p class="text-sm text-brown/60 mt-1">لوحة التحكم الإدارية</p>
      </div>
      <label class="block text-sm font-bold mb-2">البريد الإلكتروني</label>
      <input id="login-email" type="email" required dir="ltr" class="inp mb-4" autocomplete="username">
      <label class="block text-sm font-bold mb-2">كلمة المرور</label>
      <input id="login-password" type="password" required dir="ltr" class="inp mb-5" autocomplete="current-password">
      <div id="login-error" class="hidden text-sm text-red-600 bg-red-50 rounded-xl p-3 mb-4"></div>
      <button class="btn btn-gold w-full py-3.5 text-base">تسجيل الدخول</button>
    </form>
  </div>`;
  document.getElementById('login-form').addEventListener('submit', async e => {
    e.preventDefault();
    const errBox = document.getElementById('login-error');
    errBox.classList.add('hidden');
    try {
      const r = await api.post('/auth/login', { email: document.getElementById('login-email').value, password: document.getElementById('login-password').value });
      S.user = r.data.user; S.view = 'dashboard'; renderShell();
    } catch (err) { errBox.textContent = errMsg(err); errBox.classList.remove('hidden'); }
  });
}

// ---------- SHELL ----------
const NAV = [
  ['dashboard', 'fa-gauge', 'نظرة عامة', null],
  ['leads', 'fa-inbox', 'الطلبات (CRM)', 'leads'],
  ['products', 'fa-couch', 'المنتجات', 'products'],
  ['categories', 'fa-layer-group', 'الفئات', 'categories'],
  ['services', 'fa-handshake', 'الخدمات', 'services'],
  ['projects', 'fa-building', 'المشاريع', 'projects'],
  ['homepage', 'fa-house', 'الصفحة الرئيسية', 'homepage'],
  ['settings', 'fa-gear', 'الإعدادات', 'homepage'],
  ['users', 'fa-users-gear', 'المستخدمون', 'super'],
  ['audit', 'fa-clock-rotate-left', 'سجل النشاط', 'super'],
];
const PERMS = { super_admin: ['*'], content_manager: ['products','categories','services','projects','media','homepage','dashboard'], sales: ['leads','dashboard'], editor: ['products','categories','services','projects','homepage','dashboard'] };
function can(perm) {
  if (!perm) return true;
  if (perm === 'super') return S.user.role === 'super_admin';
  const p = PERMS[S.user.role] || [];
  return p.includes('*') || p.includes(perm);
}
function renderShell() {
  const links = NAV.filter(n => can(n[3])).map(([id, icon, label]) =>
    `<a href="#${id}" data-nav="${id}" class="side-link ${S.view === id ? 'active' : ''}"><i class="fas ${icon} w-5"></i>${label}</a>`).join('');
  app.innerHTML = `
  <div class="min-h-screen flex">
    <aside id="sidebar" class="w-64 bg-charcoal text-white flex-col p-4 hidden lg:flex shrink-0">
      <div class="flex items-center gap-3 px-2 py-4 mb-4 border-b border-white/10">
        <span class="w-10 h-10 rounded-full bg-gold/20 text-gold flex items-center justify-center"><i class="fas fa-couch"></i></span>
        <div><p class="font-black text-sm">سرايا الأندلس</p><p class="text-[11px] text-white/50">لوحة التحكم</p></div>
      </div>
      <nav class="space-y-1 flex-1">${links}</nav>
      <a href="/" target="_blank" class="side-link"><i class="fas fa-arrow-up-right-from-square w-5"></i>عرض الموقع</a>
      <button id="logout-btn" class="side-link text-red-300 hover:text-red-200 w-full text-right"><i class="fas fa-right-from-bracket w-5"></i>تسجيل الخروج</button>
    </aside>
    <div class="flex-1 min-w-0">
      <header class="bg-white border-b border-sand h-16 flex items-center justify-between px-5 sticky top-0 z-30">
        <div class="flex items-center gap-3">
          <button id="mobile-menu-btn" class="lg:hidden text-charcoal text-xl"><i class="fas fa-bars"></i></button>
          <h1 id="page-title" class="font-black text-lg text-charcoal"></h1>
        </div>
        <div class="flex items-center gap-3 text-sm">
          <span class="hidden sm:block text-brown/70">${esc(S.user.name)}</span>
          <span class="badge bg-gold/15 text-golddark">${ROLE_LABELS[S.user.role] || S.user.role}</span>
        </div>
      </header>
      <nav id="mobile-nav" class="hidden lg:hidden bg-charcoal p-3 space-y-1">${links}</nav>
      <main id="view" class="p-5 md:p-8 max-w-7xl mx-auto"></main>
    </div>
  </div>`;
  app.querySelectorAll('[data-nav]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); go(a.dataset.nav); }));
  document.getElementById('logout-btn').addEventListener('click', async () => { await api.post('/auth/logout'); S.user = null; renderLogin(); });
  document.getElementById('mobile-menu-btn').addEventListener('click', () => document.getElementById('mobile-nav').classList.toggle('hidden'));
  go(S.view);
}
function go(view) {
  S.view = view;
  app.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === view));
  const mn = document.getElementById('mobile-nav'); if (mn) mn.classList.add('hidden');
  const titles = { dashboard: 'نظرة عامة', leads: 'الطلبات (CRM)', products: 'المنتجات', categories: 'الفئات', services: 'الخدمات', projects: 'المشاريع', homepage: 'الصفحة الرئيسية', settings: 'الإعدادات', users: 'المستخدمون', audit: 'سجل النشاط' };
  document.getElementById('page-title').textContent = titles[view] || '';
  const v = document.getElementById('view');
  v.innerHTML = '<div class="text-center py-20 text-brown/50"><i class="fas fa-spinner fa-spin text-2xl"></i></div>';
  ({ dashboard: vDashboard, leads: vLeads, products: vProducts, categories: vCategories, services: vServices, projects: vProjects, homepage: vHomepage, settings: vSettings, users: vUsers, audit: vAudit }[view] || vDashboard)(v);
}

// ---------- DASHBOARD ----------
async function vDashboard(v) {
  try {
    const { data } = await api.get('/admin/stats');
    const st = data.stats || {};
    const card = (icon, label, val, color) => `
      <article class="bg-white rounded-2xl p-5 flex items-center gap-4">
        <span class="w-12 h-12 rounded-xl ${color} flex items-center justify-center text-xl"><i class="fas ${icon}"></i></span>
        <div><p class="text-2xl font-black text-charcoal">${val ?? 0}</p><p class="text-xs text-brown/60 font-semibold">${label}</p></div>
      </article>`;
    v.innerHTML = `
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      ${card('fa-inbox', 'طلبات جديدة', st.leads_new, 'bg-blue-50 text-blue-600')}
      ${card('fa-file-invoice', 'طلبات عرض سعر', st.quotes_total, 'bg-gold/10 text-golddark')}
      ${card('fa-couch', 'منتجات منشورة', st.products_published, 'bg-green-50 text-green-600')}
      ${card('fa-eye', 'مشاهدات الصفحات', st.page_views, 'bg-purple-50 text-purple-600')}
      ${card('fa-envelope', 'رسائل تواصل', st.messages_total, 'bg-cyan-50 text-cyan-600')}
      ${card('fa-layer-group', 'الفئات', st.categories_total, 'bg-amber-50 text-amber-600')}
      ${card('fa-building', 'المشاريع', st.projects_total, 'bg-indigo-50 text-indigo-600')}
      ${card('fab fa-whatsapp', 'نقرات واتساب', st.whatsapp_clicks, 'bg-emerald-50 text-emerald-600')}
    </div>
    <div class="grid lg:grid-cols-2 gap-6">
      <section class="bg-white rounded-2xl p-6">
        <h2 class="font-black text-charcoal mb-4"><i class="fas fa-inbox text-gold ml-2"></i>أحدث الطلبات</h2>
        ${(data.recent_leads || []).length ? `<table class="tbl"><thead><tr><th>المرجع</th><th>الاسم</th><th>الحالة</th><th>التاريخ</th></tr></thead><tbody>
          ${data.recent_leads.map(l => `<tr class="cursor-pointer" onclick="location.hash='leads'"><td dir="ltr" class="text-xs">${esc(l.request_ref)}</td><td>${esc(l.name)}</td><td>${leadBadge(l.status)}</td><td class="text-xs text-brown/60">${fmtDate(l.created_at)}</td></tr>`).join('')}
        </tbody></table>` : '<p class="text-brown/50 text-sm">لا توجد طلبات بعد.</p>'}
      </section>
      <section class="bg-white rounded-2xl p-6">
        <h2 class="font-black text-charcoal mb-4"><i class="fas fa-clock-rotate-left text-gold ml-2"></i>آخر النشاطات</h2>
        ${(data.recent_activity || []).length ? `<ul class="space-y-3 text-sm">
          ${data.recent_activity.map(a => `<li class="flex justify-between border-b border-sand/60 pb-2"><span><b>${esc(a.user_email || 'النظام')}</b> — ${esc(a.action)} (${esc(a.entity)}${a.entity_id ? ' #' + a.entity_id : ''})</span><span class="text-xs text-brown/50">${fmtDate(a.created_at)}</span></li>`).join('')}
        </ul>` : '<p class="text-brown/50 text-sm">لا يوجد نشاط.</p>'}
      </section>
    </div>`;
    document.querySelectorAll('#view tr[onclick]').forEach(tr => tr.addEventListener('click', () => go('leads')));
  } catch (e) { v.innerHTML = `<p class="text-red-600">${errMsg(e)}</p>`; }
}

window.__go = go;
if (!window.__adminBooted) {
  window.__adminBooted = true;
  api.get('/auth/me').then(r => { S.user = r.data.user; renderShell(); }).catch(() => renderLogin());
}
// modules appended below define vLeads, vProducts, etc.

// ---------- LEADS CRM ----------
async function vLeads(v, filters = {}) {
  try {
    const params = new URLSearchParams(Object.entries(filters).filter(([,x]) => x));
    const { data } = await api.get('/admin/leads?' + params);
    v.innerHTML = `
    <div class="flex flex-wrap items-center gap-3 mb-5">
      <select id="f-status" class="inp !w-auto">
        <option value="">كل الحالات</option>
        ${Object.entries(LEAD_STATUS).map(([k,[l]]) => `<option value="${k}" ${filters.status===k?'selected':''}>${l}</option>`).join('')}
      </select>
      <select id="f-type" class="inp !w-auto">
        <option value="">كل الأنواع</option>
        <option value="quote" ${filters.type==='quote'?'selected':''}>عرض سعر</option>
        <option value="contact" ${filters.type==='contact'?'selected':''}>تواصل</option>
      </select>
      <input id="f-q" class="inp !w-56" placeholder="بحث بالاسم / الهاتف / المرجع..." value="${esc(filters.q||'')}">
      <button id="f-apply" class="btn btn-gold"><i class="fas fa-filter ml-1"></i>تصفية</button>
    </div>
    <div class="bg-white rounded-2xl overflow-x-auto">
      ${data.leads.length ? `<table class="tbl"><thead><tr><th>المرجع</th><th>النوع</th><th>الاسم</th><th>الهاتف</th><th>المشروع</th><th>الحالة</th><th>التاريخ</th><th></th></tr></thead><tbody>
        ${data.leads.map(l => `<tr>
          <td dir="ltr" class="text-xs font-semibold">${esc(l.request_ref)}</td>
          <td>${l.type === 'quote' ? '<span class="badge bg-gold/15 text-golddark">عرض سعر</span>' : '<span class="badge bg-cyan-100 text-cyan-800">تواصل</span>'}</td>
          <td class="font-semibold">${esc(l.name)}${l.company ? `<br><span class="text-xs text-brown/50">${esc(l.company)}</span>` : ''}</td>
          <td dir="ltr">${esc(l.phone)}</td>
          <td class="text-xs">${esc(l.project_type || '—')}${l.city ? ' / ' + esc(l.city) : ''}</td>
          <td>${leadBadge(l.status)}</td>
          <td class="text-xs text-brown/60">${fmtDate(l.created_at)}</td>
          <td><button class="btn btn-ghost !py-1.5 !px-3 text-xs" data-open="${l.id}"><i class="fas fa-eye"></i></button></td>
        </tr>`).join('')}
      </tbody></table>` : '<p class="text-center text-brown/50 py-16">لا توجد طلبات مطابقة.</p>'}
    </div>`;
    document.getElementById('f-apply').addEventListener('click', () =>
      vLeads(v, { status: document.getElementById('f-status').value, type: document.getElementById('f-type').value, q: document.getElementById('f-q').value }));
    v.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => openLead(+b.dataset.open, () => vLeads(v, filters))));
  } catch (e) { v.innerHTML = `<p class="text-red-600">${errMsg(e)}</p>`; }
}
async function openLead(id, refresh) {
  const { data } = await api.get('/admin/leads/' + id);
  const l = data.lead;
  let prods = [];
  try { prods = l.products_requested ? JSON.parse(l.products_requested) : []; } catch {}
  const m = modal(`
    <h2 class="text-xl font-black text-charcoal mb-1">${esc(l.name)} <span class="text-sm font-normal text-brown/50" dir="ltr">${esc(l.request_ref)}</span></h2>
    <p class="text-sm text-brown/60 mb-4">${fmtDate(l.created_at)}</p>
    <div class="grid sm:grid-cols-2 gap-3 text-sm mb-4">
      <p><b>الهاتف:</b> <span dir="ltr">${esc(l.phone)}</span></p>
      ${l.whatsapp ? `<p><b>واتساب:</b> <span dir="ltr">${esc(l.whatsapp)}</span></p>` : ''}
      ${l.email ? `<p><b>البريد:</b> <span dir="ltr">${esc(l.email)}</span></p>` : ''}
      ${l.company ? `<p><b>الشركة:</b> ${esc(l.company)}</p>` : ''}
      ${l.project_type ? `<p><b>نوع المشروع:</b> ${esc(l.project_type)}</p>` : ''}
      ${l.city ? `<p><b>المدينة:</b> ${esc(l.city)}</p>` : ''}
      ${l.units_count ? `<p><b>عدد الوحدات:</b> ${esc(l.units_count)}</p>` : ''}
    </div>
    ${prods.length ? `<p class="text-sm mb-3"><b>المنتجات المطلوبة:</b> ${prods.map(p => esc(p.name)).join('، ')}</p>` : ''}
    ${l.message ? `<div class="bg-sand/50 rounded-xl p-4 text-sm mb-4 whitespace-pre-wrap">${esc(l.message)}</div>` : ''}
    <div class="flex items-center gap-3 mb-5">
      <label class="text-sm font-bold">الحالة:</label>
      <select id="lead-status" class="inp !w-auto">
        ${Object.entries(LEAD_STATUS).map(([k,[lb]]) => `<option value="${k}" ${l.status===k?'selected':''}>${lb}</option>`).join('')}
      </select>
      <a href="https://wa.me/${(l.whatsapp||l.phone||'').replace(/\D/g,'').replace(/^0/,'2')}" target="_blank" class="btn btn-gold !bg-[#25D366] text-xs"><i class="fab fa-whatsapp ml-1"></i>واتساب</a>
    </div>
    <h3 class="font-black text-sm mb-2">الملاحظات</h3>
    <div id="lead-notes" class="space-y-2 mb-3 max-h-40 overflow-y-auto">
      ${(data.notes||[]).map(n => `<div class="bg-cream rounded-xl p-3 text-sm"><p>${esc(n.note)}</p><p class="text-[11px] text-brown/50 mt-1">${esc(n.user_name||'')} — ${fmtDate(n.created_at)}</p></div>`).join('') || '<p class="text-xs text-brown/50">لا توجد ملاحظات.</p>'}
    </div>
    <div class="flex gap-2 mb-2">
      <input id="lead-note-input" class="inp" placeholder="أضف ملاحظة...">
      <button id="lead-note-add" class="btn btn-dark text-xs">إضافة</button>
    </div>
    <div class="flex justify-between mt-4">
      <button id="lead-delete" class="btn btn-red text-xs"><i class="fas fa-trash ml-1"></i>حذف الطلب</button>
    </div>`);
  m.querySelector('#lead-status').addEventListener('change', async e => {
    try { await api.put('/admin/leads/' + id, { status: e.target.value }); toast('تم تحديث الحالة'); refresh(); } catch (er) { toast(errMsg(er), false); }
  });
  m.querySelector('#lead-note-add').addEventListener('click', async () => {
    const note = m.querySelector('#lead-note-input').value.trim();
    if (!note) return;
    try { await api.post(`/admin/leads/${id}/notes`, { note }); m.remove(); openLead(id, refresh); } catch (er) { toast(errMsg(er), false); }
  });
  m.querySelector('#lead-delete').addEventListener('click', async () => {
    if (!confirm('حذف هذا الطلب نهائياً؟')) return;
    try { await api.delete('/admin/leads/' + id); toast('تم الحذف'); m.remove(); refresh(); } catch (er) { toast(errMsg(er), false); }
  });
}

// ---------- MEDIA PICKER ----------
async function pickImage(cb) {
  const { data } = await api.get('/admin/media').catch(() => ({ data: { media: [] } }));
  const m = modal(`
    <h2 class="text-lg font-black mb-4">اختر صورة</h2>
    <input id="media-url-input" class="inp mb-3" dir="ltr" placeholder="أو الصق رابط صورة...">
    <button id="media-url-use" class="btn btn-dark text-xs mb-4">استخدام الرابط</button>
    <div class="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
      ${(data.media||[]).map(im => `<button data-pick="${esc(im.url)}" class="rounded-xl overflow-hidden h-24 border-2 border-transparent hover:border-gold"><img src="${esc(im.url)}" loading="lazy" class="w-full h-full object-cover"></button>`).join('')}
    </div>`);
  m.querySelectorAll('[data-pick]').forEach(b => b.addEventListener('click', () => { cb(b.dataset.pick); m.remove(); }));
  m.querySelector('#media-url-use').addEventListener('click', () => {
    const u = m.querySelector('#media-url-input').value.trim();
    if (u) { cb(u); m.remove(); }
  });
}

// ---------- PRODUCTS ----------
async function vProducts(v) {
  try {
    const [{ data }, cats] = await Promise.all([api.get('/admin/products'), api.get('/admin/categories').catch(() => ({ data: { categories: [] } }))]);
    S.cache.categories = cats.data.categories || [];
    v.innerHTML = `
    <div class="flex justify-between items-center mb-5">
      <p class="text-sm text-brown/60">${data.products.length} منتج</p>
      <button id="prod-add" class="btn btn-gold"><i class="fas fa-plus ml-1"></i>منتج جديد</button>
    </div>
    <div class="bg-white rounded-2xl overflow-x-auto">
      ${data.products.length ? `<table class="tbl"><thead><tr><th>الصورة</th><th>الاسم</th><th>الفئة</th><th>الحالة</th><th>مميز</th><th>مشاهدات</th><th></th></tr></thead><tbody>
        ${data.products.map(p => `<tr>
          <td><img src="${esc(p.main_image || '/static/images/hero-main.jpg')}" class="w-14 h-11 object-cover rounded-lg"></td>
          <td class="font-semibold">${esc(p.name_ar)}</td>
          <td class="text-xs">${esc(p.category_name || '—')}</td>
          <td>${p.status === 'published' ? '<span class="badge bg-green-100 text-green-800">منشور</span>' : '<span class="badge bg-gray-100 text-gray-600">مسودة</span>'}</td>
          <td>${p.is_featured ? '<i class="fas fa-star text-gold"></i>' : ''}</td>
          <td class="text-xs">${p.views || 0}</td>
          <td class="whitespace-nowrap">
            <button class="btn btn-ghost !py-1 !px-2.5 text-xs" data-edit="${p.id}"><i class="fas fa-pen"></i></button>
            <button class="btn btn-ghost !py-1 !px-2.5 text-xs" data-toggle="${p.id}" data-status="${p.status}" title="نشر/إلغاء">${p.status === 'published' ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-upload"></i>'}</button>
            <button class="btn btn-red !py-1 !px-2.5 text-xs" data-del="${p.id}"><i class="fas fa-trash"></i></button>
          </td></tr>`).join('')}
      </tbody></table>` : '<p class="text-center text-brown/50 py-16">لا توجد منتجات — أضف أول منتج.</p>'}
    </div>`;
    document.getElementById('prod-add').addEventListener('click', () => productForm(null, () => vProducts(v)));
    v.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', async () => {
      const { data: d } = await api.get('/admin/products/' + b.dataset.edit);
      productForm({ ...d.product, images: (d.images||[]).map(i => i.url) }, () => vProducts(v));
    }));
    v.querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', async () => {
      try { await api.put('/admin/products/' + b.dataset.toggle, { status: b.dataset.status === 'published' ? 'draft' : 'published' }); toast('تم التحديث'); vProducts(v); } catch (e) { toast(errMsg(e), false); }
    }));
    v.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', async () => {
      if (!confirm('حذف المنتج نهائياً؟')) return;
      try { await api.delete('/admin/products/' + b.dataset.del); toast('تم الحذف'); vProducts(v); } catch (e) { toast(errMsg(e), false); }
    }));
  } catch (e) { v.innerHTML = `<p class="text-red-600">${errMsg(e)}</p>`; }
}
function productForm(p, refresh) {
  p = p || {};
  const cats = S.cache.categories || [];
  const m = modal(`
    <h2 class="text-lg font-black mb-5">${p.id ? 'تعديل منتج' : 'منتج جديد'}</h2>
    <div class="grid sm:grid-cols-2 gap-4">
      <div class="sm:col-span-2"><label class="text-xs font-bold">الاسم بالعربية *</label><input id="pf-name_ar" class="inp mt-1" value="${esc(p.name_ar||'')}"></div>
      <div><label class="text-xs font-bold">الاسم بالإنجليزية</label><input id="pf-name_en" class="inp mt-1" dir="ltr" value="${esc(p.name_en||'')}"></div>
      <div><label class="text-xs font-bold">SKU</label><input id="pf-sku" class="inp mt-1" dir="ltr" value="${esc(p.sku||'')}"></div>
      <div><label class="text-xs font-bold">الفئة</label><select id="pf-category_id" class="inp mt-1">
        <option value="">بدون فئة</option>
        ${cats.map(c => `<option value="${c.id}" ${p.category_id===c.id?'selected':''}>${esc(c.name_ar)}</option>`).join('')}
      </select></div>
      <div><label class="text-xs font-bold">الأبعاد</label><input id="pf-dimensions" class="inp mt-1" value="${esc(p.dimensions||'')}"></div>
      <div class="sm:col-span-2"><label class="text-xs font-bold">وصف مختصر</label><input id="pf-short_desc_ar" class="inp mt-1" value="${esc(p.short_desc_ar||'')}"></div>
      <div class="sm:col-span-2"><label class="text-xs font-bold">الوصف الكامل</label><textarea id="pf-description_ar" rows="3" class="inp mt-1">${esc(p.description_ar||'')}</textarea></div>
      <div class="sm:col-span-2"><label class="text-xs font-bold">المميزات (سطر لكل ميزة)</label><textarea id="pf-features_ar" rows="3" class="inp mt-1">${esc(p.features_ar||'')}</textarea></div>
      <div><label class="text-xs font-bold">الخامات</label><input id="pf-materials_ar" class="inp mt-1" value="${esc(p.materials_ar||'')}"></div>
      <div><label class="text-xs font-bold">السعر (اختياري)</label><input id="pf-price" type="number" class="inp mt-1" dir="ltr" value="${p.price||''}"></div>
      <div class="sm:col-span-2">
        <label class="text-xs font-bold">الصورة الرئيسية</label>
        <div class="flex items-center gap-3 mt-1">
          <img id="pf-main-preview" src="${esc(p.main_image||'/static/images/hero-main.jpg')}" class="w-20 h-14 object-cover rounded-lg border border-sand">
          <button type="button" id="pf-pick-main" class="btn btn-ghost text-xs">اختيار صورة</button>
        </div>
      </div>
      <div class="sm:col-span-2">
        <label class="text-xs font-bold">معرض الصور</label>
        <div id="pf-gallery" class="flex flex-wrap gap-2 mt-2"></div>
        <button type="button" id="pf-add-img" class="btn btn-ghost text-xs mt-2"><i class="fas fa-plus ml-1"></i>إضافة صورة</button>
      </div>
      <div class="sm:col-span-2 flex flex-wrap gap-5 text-sm font-semibold">
        <label><input type="checkbox" id="pf-is_featured" ${p.is_featured?'checked':''}> مميز</label>
        <label><input type="checkbox" id="pf-is_new" ${p.is_new?'checked':''}> جديد</label>
        <label><input type="checkbox" id="pf-is_offer" ${p.is_offer?'checked':''}> عرض</label>
        <label><input type="checkbox" id="pf-show_price" ${p.show_price?'checked':''}> إظهار السعر</label>
        <label><input type="checkbox" id="pf-published" ${p.status==='published'?'checked':''}> منشور</label>
      </div>
    </div>
    <div id="pf-error" class="hidden text-sm text-red-600 bg-red-50 rounded-xl p-3 mt-4"></div>
    <button id="pf-save" class="btn btn-gold w-full mt-5 py-3">${p.id ? 'حفظ التعديلات' : 'إنشاء المنتج'}</button>`);
  let mainImage = p.main_image || '';
  let images = Array.isArray(p.images) ? [...p.images] : [];
  const renderGallery = () => {
    m.querySelector('#pf-gallery').innerHTML = images.map((u, i) =>
      `<span class="relative"><img src="${esc(u)}" class="w-16 h-12 object-cover rounded-lg border border-sand"><button data-rm="${i}" class="absolute -top-1.5 -left-1.5 w-5 h-5 bg-red-600 text-white rounded-full text-[10px]"><i class="fas fa-xmark"></i></button></span>`).join('');
    m.querySelectorAll('[data-rm]').forEach(b => b.addEventListener('click', () => { images.splice(+b.dataset.rm, 1); renderGallery(); }));
  };
  renderGallery();
  m.querySelector('#pf-pick-main').addEventListener('click', () => pickImage(u => { mainImage = u; m.querySelector('#pf-main-preview').src = u; }));
  m.querySelector('#pf-add-img').addEventListener('click', () => pickImage(u => { images.push(u); renderGallery(); }));
  m.querySelector('#pf-save').addEventListener('click', async () => {
    const g = id => m.querySelector('#pf-' + id);
    const body = {
      name_ar: g('name_ar').value.trim(), name_en: g('name_en').value.trim() || null, sku: g('sku').value.trim() || null,
      category_id: g('category_id').value ? +g('category_id').value : null, dimensions: g('dimensions').value.trim() || null,
      short_desc_ar: g('short_desc_ar').value.trim() || null, description_ar: g('description_ar').value.trim() || null,
      features_ar: g('features_ar').value.trim() || null, materials_ar: g('materials_ar').value.trim() || null,
      price: g('price').value ? +g('price').value : null, main_image: mainImage || null, images,
      is_featured: g('is_featured').checked ? 1 : 0, is_new: g('is_new').checked ? 1 : 0,
      is_offer: g('is_offer').checked ? 1 : 0, show_price: g('show_price').checked ? 1 : 0,
      status: g('published').checked ? 'published' : 'draft'
    };
    const eb = m.querySelector('#pf-error'); eb.classList.add('hidden');
    if (!body.name_ar) { eb.textContent = 'الاسم بالعربية مطلوب'; eb.classList.remove('hidden'); return; }
    try {
      if (p.id) await api.put('/admin/products/' + p.id, body); else await api.post('/admin/products', body);
      toast('تم الحفظ بنجاح'); m.remove(); refresh();
    } catch (er) { eb.textContent = errMsg(er); eb.classList.remove('hidden'); }
  });
}

// ---------- CATEGORIES ----------
async function vCategories(v) {
  try {
    const { data } = await api.get('/admin/categories');
    v.innerHTML = `
    <div class="flex justify-between items-center mb-5">
      <p class="text-sm text-brown/60">${data.categories.length} فئة</p>
      <button id="cat-add" class="btn btn-gold"><i class="fas fa-plus ml-1"></i>فئة جديدة</button>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      ${data.categories.map(c => `
      <article class="bg-white rounded-2xl overflow-hidden">
        <img src="${esc(c.image_url || '/static/images/hero-main.jpg')}" class="w-full h-32 object-cover">
        <div class="p-4">
          <div class="flex items-center justify-between mb-1">
            <h3 class="font-bold"><i class="fas ${esc(c.icon||'fa-couch')} text-gold ml-1"></i>${esc(c.name_ar)}</h3>
            ${c.is_active ? '<span class="badge bg-green-100 text-green-800">نشط</span>' : '<span class="badge bg-gray-100 text-gray-600">معطل</span>'}
          </div>
          <p class="text-xs text-brown/60 mb-3">${c.products_count} منتج · ترتيب ${c.sort_order}</p>
          <div class="flex gap-2">
            <button class="btn btn-ghost !py-1 !px-3 text-xs" data-edit="${c.id}"><i class="fas fa-pen"></i></button>
            <button class="btn btn-red !py-1 !px-3 text-xs" data-del="${c.id}"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </article>`).join('')}
    </div>`;
    const catForm = (c) => {
      c = c || {};
      const m = modal(`
        <h2 class="text-lg font-black mb-5">${c.id ? 'تعديل فئة' : 'فئة جديدة'}</h2>
        <div class="grid sm:grid-cols-2 gap-4">
          <div><label class="text-xs font-bold">الاسم بالعربية *</label><input id="cf-name_ar" class="inp mt-1" value="${esc(c.name_ar||'')}"></div>
          <div><label class="text-xs font-bold">الاسم بالإنجليزية</label><input id="cf-name_en" class="inp mt-1" dir="ltr" value="${esc(c.name_en||'')}"></div>
          <div class="sm:col-span-2"><label class="text-xs font-bold">الوصف</label><textarea id="cf-description_ar" rows="2" class="inp mt-1">${esc(c.description_ar||'')}</textarea></div>
          <div><label class="text-xs font-bold">أيقونة FontAwesome</label><input id="cf-icon" class="inp mt-1" dir="ltr" value="${esc(c.icon||'fa-couch')}"></div>
          <div><label class="text-xs font-bold">الترتيب</label><input id="cf-sort_order" type="number" class="inp mt-1" dir="ltr" value="${c.sort_order ?? 0}"></div>
          <div class="sm:col-span-2">
            <label class="text-xs font-bold">الصورة</label>
            <div class="flex items-center gap-3 mt-1">
              <img id="cf-preview" src="${esc(c.image_url||'/static/images/hero-main.jpg')}" class="w-20 h-14 object-cover rounded-lg border border-sand">
              <button type="button" id="cf-pick" class="btn btn-ghost text-xs">اختيار صورة</button>
            </div>
          </div>
          <label class="text-sm font-semibold"><input type="checkbox" id="cf-is_active" ${c.is_active !== 0 ? 'checked' : ''}> نشط</label>
        </div>
        <div id="cf-error" class="hidden text-sm text-red-600 bg-red-50 rounded-xl p-3 mt-4"></div>
        <button id="cf-save" class="btn btn-gold w-full mt-5 py-3">حفظ</button>`);
      let img = c.image_url || '';
      m.querySelector('#cf-pick').addEventListener('click', () => pickImage(u => { img = u; m.querySelector('#cf-preview').src = u; }));
      m.querySelector('#cf-save').addEventListener('click', async () => {
        const g = id => m.querySelector('#cf-' + id);
        const body = { name_ar: g('name_ar').value.trim(), name_en: g('name_en').value.trim() || null, description_ar: g('description_ar').value.trim() || null,
          icon: g('icon').value.trim() || null, sort_order: +g('sort_order').value || 0, image_url: img || null, is_active: g('is_active').checked ? 1 : 0 };
        const eb = m.querySelector('#cf-error'); eb.classList.add('hidden');
        if (!body.name_ar) { eb.textContent = 'الاسم مطلوب'; eb.classList.remove('hidden'); return; }
        try {
          if (c.id) await api.put('/admin/categories/' + c.id, body); else await api.post('/admin/categories', body);
          toast('تم الحفظ'); m.remove(); vCategories(v);
        } catch (er) { eb.textContent = errMsg(er); eb.classList.remove('hidden'); }
      });
    };
    document.getElementById('cat-add').addEventListener('click', () => catForm(null));
    v.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => catForm(data.categories.find(x => x.id === +b.dataset.edit))));
    v.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', async () => {
      if (!confirm('حذف الفئة؟')) return;
      try { await api.delete('/admin/categories/' + b.dataset.del); toast('تم الحذف'); vCategories(v); } catch (e) { toast(errMsg(e), false); }
    }));
  } catch (e) { v.innerHTML = `<p class="text-red-600">${errMsg(e)}</p>`; }
}

// ---------- SERVICES ----------
async function vServices(v) {
  try {
    const { data } = await api.get('/admin/services');
    v.innerHTML = `
    <div class="flex justify-between items-center mb-5">
      <p class="text-sm text-brown/60">${data.services.length} خدمة</p>
      <button id="svc-add" class="btn btn-gold"><i class="fas fa-plus ml-1"></i>خدمة جديدة</button>
    </div>
    <div class="bg-white rounded-2xl overflow-x-auto">
      <table class="tbl"><thead><tr><th>الخدمة</th><th>وصف مختصر</th><th>الحالة</th><th>ترتيب</th><th></th></tr></thead><tbody>
        ${data.services.map(s => `<tr>
          <td class="font-semibold"><i class="fas ${esc(s.icon||'fa-star')} text-gold ml-2"></i>${esc(s.title_ar)}</td>
          <td class="text-xs max-w-xs truncate">${esc(s.short_desc_ar||'')}</td>
          <td>${s.is_active ? '<span class="badge bg-green-100 text-green-800">نشط</span>' : '<span class="badge bg-gray-100 text-gray-600">معطل</span>'}</td>
          <td>${s.sort_order}</td>
          <td class="whitespace-nowrap">
            <button class="btn btn-ghost !py-1 !px-3 text-xs" data-edit="${s.id}"><i class="fas fa-pen"></i></button>
            <button class="btn btn-red !py-1 !px-3 text-xs" data-del="${s.id}"><i class="fas fa-trash"></i></button>
          </td></tr>`).join('')}
      </tbody></table>
    </div>`;
    const svcForm = (s) => {
      s = s || {};
      const m = modal(`
        <h2 class="text-lg font-black mb-5">${s.id ? 'تعديل خدمة' : 'خدمة جديدة'}</h2>
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="sm:col-span-2"><label class="text-xs font-bold">العنوان بالعربية *</label><input id="sf-title_ar" class="inp mt-1" value="${esc(s.title_ar||'')}"></div>
          <div class="sm:col-span-2"><label class="text-xs font-bold">وصف مختصر</label><input id="sf-short_desc_ar" class="inp mt-1" value="${esc(s.short_desc_ar||'')}"></div>
          <div class="sm:col-span-2"><label class="text-xs font-bold">الوصف الكامل</label><textarea id="sf-description_ar" rows="3" class="inp mt-1">${esc(s.description_ar||'')}</textarea></div>
          <div class="sm:col-span-2"><label class="text-xs font-bold">المميزات (سطر لكل ميزة)</label><textarea id="sf-features_ar" rows="2" class="inp mt-1">${esc(s.features_ar||'')}</textarea></div>
          <div><label class="text-xs font-bold">أيقونة</label><input id="sf-icon" class="inp mt-1" dir="ltr" value="${esc(s.icon||'fa-star')}"></div>
          <div><label class="text-xs font-bold">الترتيب</label><input id="sf-sort_order" type="number" class="inp mt-1" dir="ltr" value="${s.sort_order ?? 0}"></div>
          <div class="sm:col-span-2">
            <label class="text-xs font-bold">الصورة</label>
            <div class="flex items-center gap-3 mt-1">
              <img id="sf-preview" src="${esc(s.image_url||'/static/images/hero-main.jpg')}" class="w-20 h-14 object-cover rounded-lg border border-sand">
              <button type="button" id="sf-pick" class="btn btn-ghost text-xs">اختيار صورة</button>
            </div>
          </div>
          <label class="text-sm font-semibold"><input type="checkbox" id="sf-is_active" ${s.is_active !== 0 ? 'checked' : ''}> نشط</label>
        </div>
        <div id="sf-error" class="hidden text-sm text-red-600 bg-red-50 rounded-xl p-3 mt-4"></div>
        <button id="sf-save" class="btn btn-gold w-full mt-5 py-3">حفظ</button>`);
      let img = s.image_url || '';
      m.querySelector('#sf-pick').addEventListener('click', () => pickImage(u => { img = u; m.querySelector('#sf-preview').src = u; }));
      m.querySelector('#sf-save').addEventListener('click', async () => {
        const g = id => m.querySelector('#sf-' + id);
        const body = { title_ar: g('title_ar').value.trim(), short_desc_ar: g('short_desc_ar').value.trim() || null,
          description_ar: g('description_ar').value.trim() || null, features_ar: g('features_ar').value.trim() || null,
          icon: g('icon').value.trim() || null, sort_order: +g('sort_order').value || 0, image_url: img || null, is_active: g('is_active').checked ? 1 : 0 };
        const eb = m.querySelector('#sf-error'); eb.classList.add('hidden');
        if (!body.title_ar) { eb.textContent = 'العنوان مطلوب'; eb.classList.remove('hidden'); return; }
        try {
          if (s.id) await api.put('/admin/services/' + s.id, body); else await api.post('/admin/services', body);
          toast('تم الحفظ'); m.remove(); vServices(v);
        } catch (er) { eb.textContent = errMsg(er); eb.classList.remove('hidden'); }
      });
    };
    document.getElementById('svc-add').addEventListener('click', () => svcForm(null));
    v.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => svcForm(data.services.find(x => x.id === +b.dataset.edit))));
    v.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', async () => {
      if (!confirm('حذف الخدمة؟')) return;
      try { await api.delete('/admin/services/' + b.dataset.del); toast('تم الحذف'); vServices(v); } catch (e) { toast(errMsg(e), false); }
    }));
  } catch (e) { v.innerHTML = `<p class="text-red-600">${errMsg(e)}</p>`; }
}

// ---------- PROJECTS ----------
async function vProjects(v) {
  try {
    const { data } = await api.get('/admin/projects');
    v.innerHTML = `
    <div class="flex justify-between items-center mb-5">
      <p class="text-sm text-brown/60">${data.projects.length} مشروع</p>
      <button id="prj-add" class="btn btn-gold"><i class="fas fa-plus ml-1"></i>مشروع جديد</button>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      ${data.projects.map(p => `
      <article class="bg-white rounded-2xl overflow-hidden">
        <img src="${esc(p.cover_image || '/static/images/hero-main.jpg')}" class="w-full h-36 object-cover">
        <div class="p-4">
          <div class="flex items-center justify-between mb-1">
            <h3 class="font-bold">${esc(p.title_ar)}</h3>
            ${p.status === 'published' ? '<span class="badge bg-green-100 text-green-800">منشور</span>' : '<span class="badge bg-gray-100 text-gray-600">مسودة</span>'}
          </div>
          <p class="text-xs text-brown/60 mb-3">${esc(p.project_type || '')} ${p.location ? '· ' + esc(p.location) : ''} ${p.is_featured ? '· <i class="fas fa-star text-gold"></i>' : ''}</p>
          <div class="flex gap-2">
            <button class="btn btn-ghost !py-1 !px-3 text-xs" data-edit="${p.id}"><i class="fas fa-pen"></i></button>
            <button class="btn btn-red !py-1 !px-3 text-xs" data-del="${p.id}"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </article>`).join('') || '<p class="text-brown/50 col-span-3 text-center py-16">لا توجد مشاريع — أضف أول مشروع.</p>'}
    </div>`;
    const prjForm = (p) => {
      p = p || {};
      const m = modal(`
        <h2 class="text-lg font-black mb-5">${p.id ? 'تعديل مشروع' : 'مشروع جديد'}</h2>
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="sm:col-span-2"><label class="text-xs font-bold">العنوان بالعربية *</label><input id="jf-title_ar" class="inp mt-1" value="${esc(p.title_ar||'')}"></div>
          <div><label class="text-xs font-bold">نوع المشروع</label><input id="jf-project_type" class="inp mt-1" value="${esc(p.project_type||'')}" placeholder="فندق / منتجع / مطعم..."></div>
          <div><label class="text-xs font-bold">الموقع</label><input id="jf-location" class="inp mt-1" value="${esc(p.location||'')}"></div>
          <div><label class="text-xs font-bold">اسم العميل (اختياري)</label><input id="jf-client_name" class="inp mt-1" value="${esc(p.client_name||'')}"></div>
          <div><label class="text-xs font-bold">تاريخ المشروع</label><input id="jf-project_date" class="inp mt-1" dir="ltr" value="${esc(p.project_date||'')}" placeholder="2026"></div>
          <div class="sm:col-span-2"><label class="text-xs font-bold">الوصف</label><textarea id="jf-description_ar" rows="3" class="inp mt-1">${esc(p.description_ar||'')}</textarea></div>
          <div class="sm:col-span-2">
            <label class="text-xs font-bold">صورة الغلاف</label>
            <div class="flex items-center gap-3 mt-1">
              <img id="jf-preview" src="${esc(p.cover_image||'/static/images/hero-main.jpg')}" class="w-20 h-14 object-cover rounded-lg border border-sand">
              <button type="button" id="jf-pick" class="btn btn-ghost text-xs">اختيار صورة</button>
            </div>
          </div>
          <div class="sm:col-span-2">
            <label class="text-xs font-bold">معرض الصور</label>
            <div id="jf-gallery" class="flex flex-wrap gap-2 mt-2"></div>
            <button type="button" id="jf-add-img" class="btn btn-ghost text-xs mt-2"><i class="fas fa-plus ml-1"></i>إضافة صورة</button>
          </div>
          <div class="sm:col-span-2 flex gap-5 text-sm font-semibold">
            <label><input type="checkbox" id="jf-is_featured" ${p.is_featured?'checked':''}> مميز</label>
            <label><input type="checkbox" id="jf-published" ${p.status==='published'?'checked':''}> منشور</label>
          </div>
        </div>
        <div id="jf-error" class="hidden text-sm text-red-600 bg-red-50 rounded-xl p-3 mt-4"></div>
        <button id="jf-save" class="btn btn-gold w-full mt-5 py-3">حفظ</button>`);
      let cover = p.cover_image || '';
      let images = Array.isArray(p.images) ? [...p.images] : [];
      const renderG = () => {
        m.querySelector('#jf-gallery').innerHTML = images.map((u, i) =>
          `<span class="relative"><img src="${esc(u)}" class="w-16 h-12 object-cover rounded-lg border border-sand"><button data-rm="${i}" class="absolute -top-1.5 -left-1.5 w-5 h-5 bg-red-600 text-white rounded-full text-[10px]"><i class="fas fa-xmark"></i></button></span>`).join('');
        m.querySelectorAll('[data-rm]').forEach(b => b.addEventListener('click', () => { images.splice(+b.dataset.rm, 1); renderG(); }));
      };
      renderG();
      m.querySelector('#jf-pick').addEventListener('click', () => pickImage(u => { cover = u; m.querySelector('#jf-preview').src = u; }));
      m.querySelector('#jf-add-img').addEventListener('click', () => pickImage(u => { images.push(u); renderG(); }));
      m.querySelector('#jf-save').addEventListener('click', async () => {
        const g = id => m.querySelector('#jf-' + id);
        const body = { title_ar: g('title_ar').value.trim(), project_type: g('project_type').value.trim() || null,
          location: g('location').value.trim() || null, client_name: g('client_name').value.trim() || null,
          project_date: g('project_date').value.trim() || null, description_ar: g('description_ar').value.trim() || null,
          cover_image: cover || null, images, is_featured: g('is_featured').checked ? 1 : 0,
          status: g('published').checked ? 'published' : 'draft' };
        const eb = m.querySelector('#jf-error'); eb.classList.add('hidden');
        if (!body.title_ar) { eb.textContent = 'العنوان مطلوب'; eb.classList.remove('hidden'); return; }
        try {
          if (p.id) await api.put('/admin/projects/' + p.id, body); else await api.post('/admin/projects', body);
          toast('تم الحفظ'); m.remove(); vProjects(v);
        } catch (er) { eb.textContent = errMsg(er); eb.classList.remove('hidden'); }
      });
    };
    document.getElementById('prj-add').addEventListener('click', () => prjForm(null));
    v.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', async () => {
      const { data: d } = await api.get('/admin/projects/' + b.dataset.edit);
      prjForm({ ...d.project, images: (d.images||[]).map(i => i.url) });
    }));
    v.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', async () => {
      if (!confirm('حذف المشروع؟')) return;
      try { await api.delete('/admin/projects/' + b.dataset.del); toast('تم الحذف'); vProjects(v); } catch (e) { toast(errMsg(e), false); }
    }));
  } catch (e) { v.innerHTML = `<p class="text-red-600">${errMsg(e)}</p>`; }
}

// ---------- HOMEPAGE ----------
async function vHomepage(v) {
  try {
    const { data } = await api.get('/admin/homepage');
    const SECTION_LABELS = { hero: 'الواجهة الرئيسية (Hero)', about: 'عن الشركة', categories: 'الفئات', featured: 'منتجات مميزة', services: 'الخدمات', projects: 'المشاريع', why_us: 'لماذا نحن', cta: 'دعوة للتواصل (CTA)' };
    v.innerHTML = `
      <h3 class="font-bold text-brown mb-3">أقسام الصفحة الرئيسية</h3>
      <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <table class="w-full text-sm">
          <thead class="bg-cream text-brown/70"><tr>
            <th class="p-3 text-right">القسم</th><th class="p-3 text-right">العنوان</th><th class="p-3">الحالة</th><th class="p-3">إجراءات</th>
          </tr></thead>
          <tbody>${(data.sections || []).map(s => `
            <tr class="border-t border-cream">
              <td class="p-3 font-semibold">${esc(SECTION_LABELS[s.section_key] || s.section_key)}</td>
              <td class="p-3">${esc(s.title_ar || '—')}</td>
              <td class="p-3 text-center"><span class="badge ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}">${s.is_active ? 'مفعّل' : 'معطّل'}</span></td>
              <td class="p-3 text-center whitespace-nowrap">
                <button data-sec-edit="${s.id}" class="text-blue-600 hover:underline ml-2"><i class="fas fa-pen"></i> تعديل</button>
                <button data-sec-toggle="${s.id}" data-active="${s.is_active}" class="text-amber-600 hover:underline"><i class="fas fa-power-off"></i> ${s.is_active ? 'تعطيل' : 'تفعيل'}</button>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-bold text-brown">نقاط "لماذا نحن"</h3>
        <button id="wu-add" class="btn-gold"><i class="fas fa-plus ml-1"></i> إضافة نقطة</button>
      </div>
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-cream text-brown/70"><tr>
            <th class="p-3 text-right">الأيقونة</th><th class="p-3 text-right">العنوان</th><th class="p-3 text-right">الوصف</th><th class="p-3">إجراءات</th>
          </tr></thead>
          <tbody>${(data.why_us || []).map(w => `
            <tr class="border-t border-cream">
              <td class="p-3"><i class="fas ${esc(w.icon || 'fa-star')} text-gold"></i> <span class="text-xs text-brown/50">${esc(w.icon || '')}</span></td>
              <td class="p-3 font-semibold">${esc(w.title_ar)}</td>
              <td class="p-3 text-brown/70">${esc(w.description_ar || '—')}</td>
              <td class="p-3 text-center whitespace-nowrap">
                <button data-wu-edit='${esc(JSON.stringify(w))}' class="text-blue-600 hover:underline ml-2"><i class="fas fa-pen"></i></button>
                <button data-wu-del="${w.id}" class="text-red-600 hover:underline"><i class="fas fa-trash"></i></button>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>`;

    const secForm = (s) => {
      const m = modal(`
        <h3 class="font-bold text-lg text-brown mb-4">تعديل قسم: ${esc(SECTION_LABELS[s.section_key] || s.section_key)}</h3>
        <div class="space-y-3">
          <div><label class="lbl">العنوان (عربي)</label><input id="hs-title" class="inp" value="${esc(s.title_ar || '')}"></div>
          <div><label class="lbl">المحتوى (عربي)</label><textarea id="hs-content" class="inp" rows="4">${esc(s.content_ar || '')}</textarea></div>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="lbl">نص الزر (CTA)</label><input id="hs-cta-text" class="inp" value="${esc(s.cta_text_ar || '')}"></div>
            <div><label class="lbl">رابط الزر</label><input id="hs-cta-url" class="inp" dir="ltr" value="${esc(s.cta_url || '')}"></div>
          </div>
          <div><label class="lbl">رابط الصورة</label>
            <div class="flex gap-2"><input id="hs-image" class="inp flex-1" dir="ltr" value="${esc(s.image_url || '')}">
            <button id="hs-pick" class="btn-outline shrink-0"><i class="fas fa-images"></i></button></div>
          </div>
          <p id="hs-error" class="text-red-600 text-sm hidden"></p>
          <div class="flex gap-2 justify-end pt-2">
            <button class="btn-outline" data-close>إلغاء</button>
            <button id="hs-save" class="btn-gold">حفظ</button>
          </div>
        </div>`);
      const g = id => m.querySelector('#' + id);
      g('hs-pick').addEventListener('click', () => pickImage(url => { g('hs-image').value = url; }));
      g('hs-save').addEventListener('click', async () => {
        const body = { title_ar: g('hs-title').value.trim(), content_ar: g('hs-content').value.trim(),
          cta_text_ar: g('hs-cta-text').value.trim(), cta_url: g('hs-cta-url').value.trim(), image_url: g('hs-image').value.trim() };
        try { await api.put('/admin/homepage/sections/' + s.id, body); toast('تم الحفظ'); m.remove(); vHomepage(v); }
        catch (er) { const eb = g('hs-error'); eb.textContent = errMsg(er); eb.classList.remove('hidden'); }
      });
    };
    v.querySelectorAll('[data-sec-edit]').forEach(b => b.addEventListener('click', () => {
      const s = (data.sections || []).find(x => x.id == b.dataset.secEdit); if (s) secForm(s);
    }));
    v.querySelectorAll('[data-sec-toggle]').forEach(b => b.addEventListener('click', async () => {
      try { await api.put('/admin/homepage/sections/' + b.dataset.secToggle, { is_active: b.dataset.active === '1' ? 0 : 1 }); toast('تم التحديث'); vHomepage(v); }
      catch (e) { toast(errMsg(e), false); }
    }));

    const wuForm = (w) => {
      w = w || {};
      const m = modal(`
        <h3 class="font-bold text-lg text-brown mb-4">${w.id ? 'تعديل نقطة' : 'إضافة نقطة'}</h3>
        <div class="space-y-3">
          <div><label class="lbl">الأيقونة (FontAwesome مثال: fa-medal)</label><input id="wu-icon" class="inp" dir="ltr" value="${esc(w.icon || 'fa-star')}"></div>
          <div><label class="lbl">العنوان (عربي) *</label><input id="wu-title" class="inp" value="${esc(w.title_ar || '')}"></div>
          <div><label class="lbl">الوصف (عربي)</label><textarea id="wu-desc" class="inp" rows="3">${esc(w.description_ar || '')}</textarea></div>
          <div><label class="lbl">الترتيب</label><input id="wu-order" type="number" class="inp" value="${w.sort_order ?? 0}"></div>
          <p id="wu-error" class="text-red-600 text-sm hidden"></p>
          <div class="flex gap-2 justify-end pt-2">
            <button class="btn-outline" data-close>إلغاء</button>
            <button id="wu-save" class="btn-gold">حفظ</button>
          </div>
        </div>`);
      const g = id => m.querySelector('#' + id);
      g('wu-save').addEventListener('click', async () => {
        const body = { icon: g('wu-icon').value.trim(), title_ar: g('wu-title').value.trim(),
          description_ar: g('wu-desc').value.trim(), sort_order: Number(g('wu-order').value) || 0 };
        const eb = g('wu-error'); eb.classList.add('hidden');
        if (!body.title_ar) { eb.textContent = 'العنوان مطلوب'; eb.classList.remove('hidden'); return; }
        try {
          if (w.id) await api.put('/admin/homepage/why-us/' + w.id, body); else await api.post('/admin/homepage/why-us', body);
          toast('تم الحفظ'); m.remove(); vHomepage(v);
        } catch (er) { eb.textContent = errMsg(er); eb.classList.remove('hidden'); }
      });
    };
    document.getElementById('wu-add').addEventListener('click', () => wuForm(null));
    v.querySelectorAll('[data-wu-edit]').forEach(b => b.addEventListener('click', () => wuForm(JSON.parse(b.dataset.wuEdit))));
    v.querySelectorAll('[data-wu-del]').forEach(b => b.addEventListener('click', async () => {
      if (!confirm('حذف النقطة؟')) return;
      try { await api.delete('/admin/homepage/why-us/' + b.dataset.wuDel); toast('تم الحذف'); vHomepage(v); } catch (e) { toast(errMsg(e), false); }
    }));
  } catch (e) { v.innerHTML = `<p class="text-red-600">${errMsg(e)}</p>`; }
}

// ---------- SETTINGS ----------
async function vSettings(v) {
  try {
    const { data } = await api.get('/admin/settings');
    const S2 = {}; (data.settings || []).forEach(r => S2[r.key] = r.value);
    const FIELDS = [
      ['company_name_ar', 'اسم الشركة (عربي)'],
      ['company_name_en', 'اسم الشركة (إنجليزي)'],
      ['phone', 'رقم الهاتف'],
      ['whatsapp', 'رقم واتساب'],
      ['address_ar', 'العنوان'],
      ['working_hours_ar', 'مواعيد العمل'],
      ['whatsapp_default_message', 'رسالة واتساب الافتراضية'],
      ['whatsapp_product_message', 'رسالة واتساب للمنتج ([PRODUCT] = اسم المنتج)'],
      ['seo_default_title', 'عنوان SEO الافتراضي'],
      ['seo_default_description', 'وصف SEO الافتراضي'],
      ['facebook_url', 'رابط فيسبوك'],
      ['instagram_url', 'رابط إنستجرام'],
    ];
    v.innerHTML = `
      <div class="bg-white rounded-xl shadow-sm p-6 max-w-3xl">
        <div class="grid md:grid-cols-2 gap-4">
          ${FIELDS.map(([k, label]) => {
            const long = k.includes('message') || k.includes('description') || k === 'address_ar';
            const dir = (k.includes('url') || k === 'phone' || k === 'whatsapp' || k.includes('_en')) ? 'ltr' : 'rtl';
            return `<div class="${long ? 'md:col-span-2' : ''}">
              <label class="lbl">${label}</label>
              ${long
                ? `<textarea data-key="${k}" class="inp" rows="2">${esc(S2[k] || '')}</textarea>`
                : `<input data-key="${k}" class="inp" dir="${dir}" value="${esc(S2[k] || '')}">`}
            </div>`;
          }).join('')}
        </div>
        <p id="st-error" class="text-red-600 text-sm hidden mt-3"></p>
        <div class="mt-5 flex justify-end">
          <button id="st-save" class="btn-gold"><i class="fas fa-save ml-1"></i> حفظ الإعدادات</button>
        </div>
      </div>`;
    document.getElementById('st-save').addEventListener('click', async () => {
      const body = {};
      v.querySelectorAll('[data-key]').forEach(el => body[el.dataset.key] = el.value.trim());
      try { await api.put('/admin/settings', body); toast('تم حفظ الإعدادات'); }
      catch (er) { const eb = document.getElementById('st-error'); eb.textContent = errMsg(er); eb.classList.remove('hidden'); }
    });
  } catch (e) { v.innerHTML = `<p class="text-red-600">${errMsg(e)}</p>`; }
}

// ---------- USERS ----------
async function vUsers(v) {
  try {
    const { data } = await api.get('/admin/users');
    v.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-bold text-brown">مستخدمو لوحة التحكم</h3>
        <button id="u-add" class="btn-gold"><i class="fas fa-user-plus ml-1"></i> إضافة مستخدم</button>
      </div>
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-cream text-brown/70"><tr>
            <th class="p-3 text-right">الاسم</th><th class="p-3 text-right">البريد</th><th class="p-3">الدور</th><th class="p-3">الحالة</th><th class="p-3">آخر دخول</th><th class="p-3">إجراءات</th>
          </tr></thead>
          <tbody>${(data.users || []).map(u => `
            <tr class="border-t border-cream">
              <td class="p-3 font-semibold">${esc(u.name)}${u.id === S.user.id ? ' <span class="text-xs text-gold">(أنت)</span>' : ''}</td>
              <td class="p-3" dir="ltr">${esc(u.email)}</td>
              <td class="p-3 text-center"><span class="badge bg-gold/15 text-golddark">${ROLE_LABELS[u.role] || u.role}</span></td>
              <td class="p-3 text-center"><span class="badge ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}">${u.is_active ? 'نشط' : 'معطّل'}</span></td>
              <td class="p-3 text-center text-brown/60">${fmtDate(u.last_login_at)}</td>
              <td class="p-3 text-center whitespace-nowrap">
                <button data-u-edit='${esc(JSON.stringify(u))}' class="text-blue-600 hover:underline ml-2"><i class="fas fa-pen"></i></button>
                ${u.id !== S.user.id ? `<button data-u-del="${u.id}" class="text-red-600 hover:underline"><i class="fas fa-trash"></i></button>` : ''}
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>`;

    const uForm = (u) => {
      u = u || {};
      const m = modal(`
        <h3 class="font-bold text-lg text-brown mb-4">${u.id ? 'تعديل مستخدم' : 'إضافة مستخدم'}</h3>
        <div class="space-y-3">
          <div><label class="lbl">الاسم *</label><input id="u-name" class="inp" value="${esc(u.name || '')}"></div>
          <div><label class="lbl">البريد الإلكتروني *</label><input id="u-email" class="inp" dir="ltr" value="${esc(u.email || '')}" ${u.id ? 'disabled' : ''}></div>
          <div><label class="lbl">الدور</label>
            <select id="u-role" class="inp">
              ${Object.entries(ROLE_LABELS).map(([r, l]) => `<option value="${r}" ${u.role === r ? 'selected' : ''}>${l}</option>`).join('')}
            </select>
          </div>
          <div><label class="lbl">${u.id ? 'كلمة مرور جديدة (اتركها فارغة للإبقاء)' : 'كلمة المرور * (8 أحرف على الأقل)'}</label>
            <input id="u-pass" type="password" class="inp" dir="ltr"></div>
          ${u.id && u.id !== S.user.id ? `
          <label class="flex items-center gap-2 text-sm text-brown">
            <input id="u-active" type="checkbox" ${u.is_active ? 'checked' : ''}> الحساب نشط
          </label>` : ''}
          <p id="u-error" class="text-red-600 text-sm hidden"></p>
          <div class="flex gap-2 justify-end pt-2">
            <button class="btn-outline" data-close>إلغاء</button>
            <button id="u-save" class="btn-gold">حفظ</button>
          </div>
        </div>`);
      const g = id => m.querySelector('#' + id);
      g('u-save').addEventListener('click', async () => {
        const eb = g('u-error'); eb.classList.add('hidden');
        const name = g('u-name').value.trim(), pass = g('u-pass').value;
        if (!name) { eb.textContent = 'الاسم مطلوب'; eb.classList.remove('hidden'); return; }
        try {
          if (u.id) {
            const body = { name, role: g('u-role').value };
            if (pass) body.password = pass;
            const ac = g('u-active'); if (ac) body.is_active = ac.checked ? 1 : 0;
            await api.put('/admin/users/' + u.id, body);
          } else {
            const email = g('u-email').value.trim();
            if (!email || !pass) { eb.textContent = 'البريد وكلمة المرور مطلوبان'; eb.classList.remove('hidden'); return; }
            await api.post('/admin/users', { name, email, password: pass, role: g('u-role').value });
          }
          toast('تم الحفظ'); m.remove(); vUsers(v);
        } catch (er) { eb.textContent = errMsg(er); eb.classList.remove('hidden'); }
      });
    };
    document.getElementById('u-add').addEventListener('click', () => uForm(null));
    v.querySelectorAll('[data-u-edit]').forEach(b => b.addEventListener('click', () => uForm(JSON.parse(b.dataset.uEdit))));
    v.querySelectorAll('[data-u-del]').forEach(b => b.addEventListener('click', async () => {
      if (!confirm('حذف المستخدم نهائياً؟')) return;
      try { await api.delete('/admin/users/' + b.dataset.uDel); toast('تم الحذف'); vUsers(v); } catch (e) { toast(errMsg(e), false); }
    }));
  } catch (e) { v.innerHTML = `<p class="text-red-600">${errMsg(e)}</p>`; }
}

// ---------- AUDIT LOG ----------
async function vAudit(v) {
  try {
    const { data } = await api.get('/admin/audit');
    const ACTION_LABELS = { create: 'إنشاء', update: 'تعديل', delete: 'حذف', login: 'تسجيل دخول', logout: 'تسجيل خروج', status_change: 'تغيير حالة' };
    const ENTITY_LABELS = { products: 'منتج', categories: 'فئة', services: 'خدمة', projects: 'مشروع', leads: 'طلب', home_sections: 'قسم رئيسية', why_us_points: 'نقطة لماذا نحن', settings: 'إعدادات', admin_users: 'مستخدم', media: 'وسائط' };
    v.innerHTML = `
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-cream text-brown/70"><tr>
            <th class="p-3 text-right">التاريخ</th><th class="p-3 text-right">المستخدم</th><th class="p-3">الإجراء</th><th class="p-3 text-right">العنصر</th>
          </tr></thead>
          <tbody>${(data.audit || []).map(a => `
            <tr class="border-t border-cream">
              <td class="p-3 text-brown/60 whitespace-nowrap">${fmtDate(a.created_at)}</td>
              <td class="p-3 font-semibold">${esc(a.user_name || a.user_email || '—')}</td>
              <td class="p-3 text-center"><span class="badge ${a.action === 'delete' ? 'bg-red-100 text-red-600' : a.action === 'create' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}">${ACTION_LABELS[a.action] || esc(a.action)}</span></td>
              <td class="p-3">${ENTITY_LABELS[a.entity] || esc(a.entity || '—')}${a.entity_id ? ` <span class="text-brown/40">#${a.entity_id}</span>` : ''}</td>
            </tr>`).join('') || '<tr><td colspan="4" class="p-6 text-center text-brown/50">لا يوجد نشاط بعد</td></tr>'}
          </tbody>
        </table>
      </div>`;
  } catch (e) { v.innerHTML = `<p class="text-red-600">${errMsg(e)}</p>`; }
}

})();
