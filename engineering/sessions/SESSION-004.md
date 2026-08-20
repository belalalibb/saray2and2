# SESSION-004 — 2026-08-20 — إصلاح لوحة الأدمن + دليل النشر والاستخدام

## طلب المستخدم
"لوحه الادمن لا تعمل شوف المشكله اي وحلها وضيف ملف في شرح كامل للطرق المتاحه لرفع المشروع
خطوه بخطوة الطرق المجانيه فقط مع شرح كامل لكيفيه التعامل مع المشروع بالنسبه للأدمن بشكل مبسط"
ثم "تابع" (بعد انقطاع + sandbox reset).

## سياق البداية
- Sandbox resets متكررة. استُعيد المشروع من GitHub (HEAD = 0111ed0).
- HEAD يحوي 4 ملفات فاسدة (lineage B): src/index.tsx "Hello!" 12 سطر،
  wrangler.jsonc بلا d1_databases، package.json بلا db:* scripts، seed.sql بـ hash قديم خاطئ.

## التشخيص (السبب الجذري)
1. PlaywrightConsoleCapture على /admin → `SyntaxError: Unexpected end of input` في admin.js.
2. `node --check` أكّد: الملف (625 سطر) مبتور بعد vProjects — ينقصه
   vHomepage / vSettings / vUsers / vAudit وإغلاق الـ IIFE `})();`.
3. جدول التوجيه (سطر ~130) يستدعي الـ 10 views، لكن عدم إغلاق الـ IIFE = الملف كله
   لا يُنفَّذ → حتى شاشة الدخول لا تظهر.
4. جميع نسخ admin.js في تاريخ git مبتورة — الفساد أصله commits المزامنة الخارجية [prj_*].

## الإصلاحات
- **admin.js**: كتابة الـ 4 views المفقودة + `})();` → 903 سطر، node --check ناجح:
  - vHomepage: أقسام الرئيسية (تعديل/تفعيل-تعطيل عبر PUT /admin/homepage/sections/:id) + why_us CRUD.
  - vSettings: نموذج 12 حقل → PUT /admin/settings.
  - vUsers: جدول + إنشاء/تعديل/حذف/تعطيل (super_admin فقط).
  - vAudit: سجل النشاط مع ACTION_LABELS + ENTITY_LABELS.
- **استعادة 4 ملفات** من 0c0260d: src/index.tsx (62 سطر)، wrangler.jsonc، package.json، seed.sql (hash 86e8bd63).
- **favicon**: public/favicon.svg + public/_routes.json (exclude /static/* و /favicon.svg)
  + <link rel="icon"> في layout.ts (سطر 36) و admin-shell.ts (سطر 9).
- **دليل-النشر-والاستخدام.md** (~9KB عربي): نشر مجاني (Cloudflare Pages يدوي + GitHub auto-deploy
  + جدول مقارنة + استكشاف أخطاء) + دليل أدمن مبسّط (10 أقسام + أدوار + مهام يومية + أمان).

## الاختبارات
- node --check admin.js ✅ | build ✅ | migrate + seed ✅ | PM2 :3000 ✅
- login → super_admin ✅ | 11 admin endpoints = 200 ✅ | / و /admin و /favicon.svg = 200 ✅

## النهاية
- Commit + push كل الإصلاحات إلى main (T15) — الريبو الآن هو النسخة الذهبية الأحدث.

## دروس
- الريبو يتعرض لفساد متكرر — بعد أي clone نفّذ فحص السلامة الموثق في RESUME.md.
