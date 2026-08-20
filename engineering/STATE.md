# STATE — webapp (موقع شركة أثاث فاخر + لوحة تحكم)
Last-Updated: 2026-08-20 (Session 002 start)

## الحقيقة الحالية
- ⚠️ SANDBOX RESET حدث قبل هذه الجلسة: كل كود الجلسات السابقة فُقد (لم يكن هناك commit أو backup).
- المشروع الآن قيد إعادة البناء الكاملة من السياق المعروف.

## المعمارية (ثابتة — لا يعاد التخطيط)
- Hono + TypeScript + Vite + Cloudflare Pages, D1 (--local dev)
- Public site: SSR عربي RTL (رئيسية/منتجات/خدمات/مشاريع/تواصل) + WhatsApp
- Admin SPA: /admin + public/static/admin.js (axios + Tailwind CDN)
- Auth: sessions table + cookie, roles: admin/editor/sales
- Tables: users, sessions, categories, products, product_images, services,
  projects, project_images, leads, homepage_sections, why_us, settings, audit_log
- Admin views: dashboard, products, categories, services, projects, leads,
  homepage, settings, users, audit
- Admin seed: admin@example.com / admin123
