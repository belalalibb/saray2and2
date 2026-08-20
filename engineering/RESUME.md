# RESUME — نقطة الاستئناف
Last-Updated: 2026-08-20 (نهاية Session 004)

## آخر Task مكتملة
T15 — إصلاح لوحة الأدمن (admin.js المبتور → 903 سطر) + دليل-النشر-والاستخدام.md + push إلى main.

## الحالة
المشروع كامل ويعمل E2E: موقع عام SSR + لوحة تحكم كاملة (10 views) + API + D1.
الأدمن: admin@saraya-andalus.com / SarayaAdmin@2026

## ⚠️ تحذير حرج — فساد متكرر في الريبو
عمليات sync خارجية (commits باسم [prj_*]) أفسدت الريبو مراراً.
النسخ الذهبية: 0c0260d (Session 003) + commit نهاية Session 004 (الأحدث).
فحص السلامة بعد أي clone:
- `wc -l public/static/admin.js` → يجب ≈903 وينتهي بـ `})();`
- `wc -l src/index.tsx` → يجب 62 (ليس نسخة "Hello!" ذات 12 سطر)
- `grep 86e8bd63 seed.sql` → يجب أن يوجد (hash كلمة السر الصحيح)
- `grep d1_databases wrangler.jsonc` → يجب أن يوجد

## Next Exact Action
T09 (إن رغب المستخدم): Deploy إنتاجي — الخطوات كاملة في دليل-النشر-والاستخدام.md
(اسأل المستخدم: حسابه الخاص BYOK أم استضافة Genspark hosted deploy).

## كيف تستأنف بعد sandbox reset
1. `git clone https://github.com/belalalibb/saray2and2.git /home/user/webapp` (أو fetch + reset إلى origin/main)
2. نفّذ فحص السلامة أعلاه — إن فسدت الملفات استعد من آخر commit سليم (git log --oneline)
3. `npm install && npm run build`
4. `npm run db:reset` (migrate + seed محلياً)
5. `pm2 start ecosystem.config.cjs` ثم `curl http://localhost:3000`
