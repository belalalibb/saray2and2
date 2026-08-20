# STATE — سرايا الأندلس للأثاث الفندقي والضيافة (Website + Admin Dashboard)
Last-Updated: 2026-08-20 (Session 004)

## الحقيقة الحالية (مصدرها: الكود المُختبَر فعلياً)
- ✅ المشروع مُستعاد بالكامل من GitHub (belalalibb/saray2and2) بعد sandbox reset.
- ✅ الكود الفعلي = الخط الكامل (lineage A) المستعاد من commit 63d2145:
  src/index.tsx (62 سطر) + src/lib/auth.ts (PBKDF2) + src/lib/helpers.ts
  + src/pages/{layout,public,admin-shell}.ts + src/routes/{api-auth,api-admin,api-public}.ts
  + public/static/admin.js (625 سطر، 10 views) + migrations/0001_initial_schema.sql (265 سطر)
- ✅ بقايا الخط الناقص (lineage B) أُزيلت: src/lib.ts, src/pages.ts, migrations/0001_schema.sql
- ✅ إصلاح كلمة السر مُطبّق: seed.sql يحوي hash PBKDF2 الصحيح لـ SarayaAdmin@2026
  (86e8bd63... مع salt ca159db9...) — تسجيل الدخول مُختبَر وناجح.

## المعمارية (ثابتة — لا يعاد التخطيط)
- Hono + TypeScript + Vite + Cloudflare Pages, D1 (--local dev)
- Public site: SSR عربي RTL (رئيسية/منتجات/خدمات/مشاريع/عن الشركة/تواصل/quote) + WhatsApp + sitemap/robots
- Admin SPA: /admin + public/static/admin.js (axios + Tailwind CDN)
- Auth: PBKDF2 (100k iters, Web Crypto) + sessions table + HttpOnly cookie (saraya_session, 12h)
- Roles: super_admin / content_manager / sales / editor (RBAC عبر requirePerm)
- Admin seed: admin@saraya-andalus.com / SarayaAdmin@2026

## نتائج الاختبار (Session 003 — كلها ✅)
- build: dist/_worker.js 93.14 kB
- Pages: / , /products , /admin , /sitemap.xml → 200 + الاسم المعتمد ظاهر
- Static images: /static/images/hero-main.jpg → 200
- POST /api/auth/login (SarayaAdmin@2026) → user super_admin ✅
- GET /api/auth/me , /api/admin/stats (12 منتج، 6 تصنيفات، 6 خدمات، 3 مشاريع) ✅
- POST /api/contact → request_ref CT-20260820-* ثم ظهر في /api/admin/leads ✅

## بيئة التشغيل
- PM2: webapp (wrangler pages dev dist --d1=webapp-production --local --port 3000)
- D1 local: migrations 0001 مطبّقة + seed.sql مُنفَّذ

## ملاحظات
- ecosystem.config.cjs موجود ويعمل.
- wrangler.jsonc: database_id = "local-placeholder" (يُستبدل عند deploy الإنتاج).
- لم يتم deploy إنتاجي بعد (Cloudflare Pages) — بانتظار قرار المستخدم.

## تحديث Session 004 (إصلاح لوحة الأدمن — بعد sandbox reset رقم 5)
- 🐛 السبب الجذري لتعطّل اللوحة: public/static/admin.js كان مبتوراً (625 سطر) — ينقصه
  vHomepage/vSettings/vUsers/vAudit + إغلاق `})();` → SyntaxError: Unexpected end of input
  → الـ SPA بأكمله لا يُقلع (حتى شاشة الدخول لا تظهر).
- ✅ الإصلاح: أُكمل الملف إلى 903 سطر (الـ 4 views المفقودة + الإغلاق). node --check ناجح.
- ✅ HEAD (0111ed0) كان يحوي 4 ملفات فاسدة (lineage B) → استُعيدت من 0c0260d:
  src/index.tsx (62 سطر) / wrangler.jsonc (d1_databases) / package.json (db:* scripts) / seed.sql (hash صحيح 86e8bd63).
- ✅ favicon: public/favicon.svg + public/_routes.json (exclude /static/* و /favicon.svg) + روابط في layout/admin-shell.
- ✅ دليل-النشر-والاستخدام.md: نشر مجاني على Cloudflare Pages خطوة بخطوة + دليل أدمن مبسّط.
- ⚠️ عند أي استعادة مستقبلية: تحقق أن admin.js ≈ 903 سطر وينتهي بـ `})();` وأن src/index.tsx = 62 سطر (ليس "Hello!").
