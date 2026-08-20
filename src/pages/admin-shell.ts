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
  ::selection { background:#b08d57; color:#fff; }
  /* Sidebar */
  .side-link { display:flex; align-items:center; gap:.75rem; padding:.7rem 1rem; border-radius:.75rem; color:#d6cfc4; font-weight:600; font-size:.9rem; transition:all .15s; cursor:pointer; }
  .side-link:hover { background:rgba(255,255,255,.07); color:#fff; }
  .side-link.active { background:linear-gradient(135deg,#b08d57,#9a7847); color:#fff; box-shadow:0 3px 10px rgba(176,141,87,.35); }
  /* Inputs */
  .inp { width:100%; border:1.5px solid #e5ddd0; border-radius:.7rem; padding:.6rem .9rem; font-size:.9rem; background:#fff; transition:border-color .15s, box-shadow .15s; }
  .inp:focus { outline:none; border-color:#b08d57; box-shadow:0 0 0 3px rgba(176,141,87,.15); }
  .inp:disabled { background:#f5f2ec; color:#8a7d6b; }
  textarea.inp { line-height:1.7; }
  .lbl { display:block; font-size:.78rem; font-weight:700; color:#4a3728; margin-bottom:.35rem; }
  /* Buttons — unified system (works standalone: btn-gold OR btn btn-gold) */
  .btn, .btn-gold, .btn-dark, .btn-red, .btn-ghost, .btn-outline {
    display:inline-flex; align-items:center; justify-content:center; gap:.4rem;
    padding:.55rem 1.15rem; border-radius:.7rem; font-weight:700; font-size:.85rem;
    cursor:pointer; border:1.5px solid transparent; transition:all .15s; white-space:nowrap;
    font-family:'Cairo',sans-serif; line-height:1.4;
  }
  .btn-gold { background:linear-gradient(135deg,#b08d57,#9a7847); color:#fff; box-shadow:0 2px 8px rgba(176,141,87,.3); }
  .btn-gold:hover { filter:brightness(1.08); box-shadow:0 4px 14px rgba(176,141,87,.4); transform:translateY(-1px); }
  .btn-dark { background:#23201c; color:#fff; }
  .btn-dark:hover { background:#3a352e; }
  .btn-red { background:#fee2e2; color:#b91c1c; }
  .btn-red:hover { background:#dc2626; color:#fff; }
  .btn-ghost { background:#efe9df; color:#4a3728; }
  .btn-ghost:hover { background:#e3dac9; }
  .btn-outline { background:#fff; color:#8f7040; border-color:#d9c9ae; }
  .btn-outline:hover { background:#faf6ef; border-color:#b08d57; }
  .btn:active, .btn-gold:active, .btn-dark:active, .btn-red:active, .btn-ghost:active, .btn-outline:active { transform:scale(.97); }
  /* Icon-only action buttons in tables */
  .act { display:inline-flex; align-items:center; justify-content:center; width:2.1rem; height:2.1rem; border-radius:.6rem; font-size:.8rem; cursor:pointer; transition:all .15s; border:none; }
  .act-edit { background:#eef4ff; color:#2563eb; } .act-edit:hover { background:#2563eb; color:#fff; }
  .act-del { background:#fee2e2; color:#dc2626; } .act-del:hover { background:#dc2626; color:#fff; }
  .act-warn { background:#fef3c7; color:#b45309; } .act-warn:hover { background:#d97706; color:#fff; }
  .act-view { background:#efe9df; color:#4a3728; } .act-view:hover { background:#b08d57; color:#fff; }
  /* Badges */
  .badge { display:inline-block; font-size:.7rem; font-weight:700; padding:.2rem .65rem; border-radius:999px; white-space:nowrap; }
  /* Tables */
  table.tbl { width:100%; font-size:.85rem; border-collapse:collapse; }
  table.tbl th { text-align:right; padding:.75rem .9rem; background:#efe9df; color:#4a3728; font-weight:700; font-size:.78rem; }
  table.tbl th:first-child { border-radius:0 .8rem 0 0; } table.tbl th:last-child { border-radius:.8rem 0 0 0; }
  table.tbl td { padding:.7rem .9rem; border-bottom:1px solid #f0ece4; vertical-align:middle; }
  table.tbl tr:last-child td { border-bottom:none; }
  table.tbl tbody tr { transition:background .12s; }
  table.tbl tbody tr:hover td { background:#faf7f2; }
  /* Cards */
  .card { background:#fff; border-radius:1rem; box-shadow:0 1px 4px rgba(35,32,28,.06); }
  /* Modal */
  .modal-bg { background:rgba(35,32,28,.6); backdrop-filter:blur(3px); animation:fadeIn .15s ease; }
  @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
  @keyframes slideUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:none } }
  .modal-card { animation:slideUp .2s ease; }
  /* Upload dropzone */
  .dropzone { border:2px dashed #d9c9ae; border-radius:1rem; background:#faf7f2; transition:all .15s; cursor:pointer; }
  .dropzone:hover, .dropzone.drag { border-color:#b08d57; background:#f5eee1; }
  /* Media picker tabs */
  .ptab { padding:.5rem 1.1rem; border-radius:.6rem; font-weight:700; font-size:.82rem; cursor:pointer; color:#8a7d6b; transition:all .15s; border:none; background:transparent; }
  .ptab.active { background:#23201c; color:#fff; }
  /* Scrollbar */
  ::-webkit-scrollbar { width:9px; height:9px; } ::-webkit-scrollbar-track { background:#efe9df; }
  ::-webkit-scrollbar-thumb { background:#c7b394; border-radius:99px; }
  ::-webkit-scrollbar-thumb:hover { background:#b08d57; }
</style>
</head>
<body>
<div id="admin-app"><div class="min-h-screen flex items-center justify-center text-brown/60"><i class="fas fa-spinner fa-spin ml-2"></i> جارٍ التحميل...</div></div>
<script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
<script src="/static/admin.js"></script>
</body>
</html>`
}
