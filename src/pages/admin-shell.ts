// ENG-012 — Admin shell page (SPA served at /admin)
export function adminShell(): string {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<title>لوحة التحكم — سرايا الأندلس</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<script>
tailwind.config = { theme: { extend: {
  colors: { charcoal:'#23201c', cream:'#faf7f2', sand:'#efe9df', gold:'#b08d57', golddark:'#8f7040', brown:'#4a3728' },
  fontFamily: { sans: ['Cairo','sans-serif'] }
}}}
</script>
<style>
  body { font-family:'Cairo',sans-serif; background:#f4f1ec; }
  .side-link { display:flex; align-items:center; gap:.75rem; padding:.7rem 1rem; border-radius:.75rem; color:#d6cfc4; font-weight:600; font-size:.9rem; transition:all .15s; }
  .side-link:hover { background:rgba(255,255,255,.06); color:#fff; }
  .side-link.active { background:#b08d57; color:#fff; }
  .inp { width:100%; border:1px solid #e5ddd0; border-radius:.75rem; padding:.6rem .9rem; font-size:.9rem; background:#fff; }
  .inp:focus { outline:none; border-color:#b08d57; }
  .btn { padding:.55rem 1.2rem; border-radius:.75rem; font-weight:700; font-size:.85rem; cursor:pointer; transition:opacity .15s; }
  .btn:hover { opacity:.88; }
  .btn-gold { background:#b08d57; color:#fff; }
  .btn-dark { background:#23201c; color:#fff; }
  .btn-red { background:#dc2626; color:#fff; }
  .btn-ghost { background:#efe9df; color:#4a3728; }
  .badge { font-size:.7rem; font-weight:700; padding:.15rem .6rem; border-radius:999px; }
  table.tbl { width:100%; font-size:.85rem; }
  table.tbl th { text-align:right; padding:.7rem .8rem; background:#efe9df; color:#4a3728; font-weight:700; }
  table.tbl td { padding:.65rem .8rem; border-bottom:1px solid #f0ece4; }
  table.tbl tr:hover td { background:#faf7f2; }
  .modal-bg { background:rgba(35,32,28,.55); }
</style>
</head>
<body>
<div id="admin-app"><div class="min-h-screen flex items-center justify-center text-brown/60"><i class="fas fa-spinner fa-spin ml-2"></i> جارٍ التحميل...</div></div>
<script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
<script src="/static/admin.js"></script>
</body>
</html>`
}
