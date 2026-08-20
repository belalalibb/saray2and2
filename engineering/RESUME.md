# RESUME — نقطة الاستئناف
Last-Updated: 2026-08-20 (نهاية Session 003)

## آخر Task مكتملة
T07 — إصلاح hash كلمة سر الأدمن (SarayaAdmin@2026) في seed.sql + اختبار login ناجح.

## الحالة
المشروع كامل ويعمل محلياً E2E (موقع عام SSR + لوحة تحكم + API + D1 local).
كل الاختبارات في STATE.md ناجحة.

## Next Exact Action
T09 (إن رغب المستخدم): Deploy إنتاجي إلى Cloudflare Pages:
1. setup_cloudflare_api_key أو gsk hosted deploy (اسأل المستخدم عن المسار)
2. إنشاء D1 production + تحديث database_id في wrangler.jsonc
3. wrangler d1 migrations apply webapp-production (remote) + seed
4. wrangler pages deploy dist

## كيف تستأنف بعد sandbox reset
1. `git clone https://github.com/belalalibb/saray2and2.git /home/user/webapp` (الريبو هو مصدر الحقيقة)
2. `npm install && npm run build`
3. `npm run db:reset` (migrate + seed محلياً)
4. `pm2 start ecosystem.config.cjs` ثم curl للتحقق
5. بيانات الدخول: admin@saraya-andalus.com / SarayaAdmin@2026

## تحذيرات
- الخط المعتمد هو lineage A (src/lib/, src/pages/, src/routes/, migrations/0001_initial_schema.sql).
  لا تُعِد ملفات src/lib.ts أو src/pages.ts أو migrations/0001_schema.sql (خط B محذوف).
- لا تغيّر hash كلمة السر في seed.sql: 86e8bd63... / salt ca159db9... = SarayaAdmin@2026.
