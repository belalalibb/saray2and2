# DECISIONS

## DEC-001
Decision: Use Cloudflare Pages + Hono + D1 SQLite instead of PostgreSQL/Node server.
Reason: Sandbox environment deploys to Cloudflare edge; D1 is the supported relational store. Same normalized schema principles apply.
Date: 2026-08-20
Status: Accepted

## DEC-002
Decision: Auth = PBKDF2 (Web Crypto) password hashing + DB-backed sessions via HttpOnly cookie. RBAC enforced server-side in Hono middleware.
Reason: Workers runtime has no bcrypt; PBKDF2-SHA256 (100k iters) is the standard Web Crypto approach.
Date: 2026-08-20
Status: Accepted

## DEC-003
Decision: Admin dashboard = single-page app served at /admin using CDN Tailwind + vanilla JS calling REST /api/admin/*. Public site = SSR HTML from Hono.
Reason: Keeps bundle light, SEO for public pages, fast admin without build complexity.
Date: 2026-08-20
Status: Accepted

## DEC-004
Decision: Catalog images extracted from Untitled-4.pdf (interior/furniture photos only). Pages with old branding "GLOBERA" / "سرايا الاندلس للاثاث الراقي" and old contact numbers were EXCLUDED per requirement to use only the approved name and contact data.
Date: 2026-08-20
Status: Accepted

## DEC-005
Decision: Products seeded as DEMO DATA (is_demo flag, seed.sql only, local) using real PDF images; company facts (clients, projects counts, years) NOT invented.
Date: 2026-08-20
Status: Accepted

## DEC-006
Decision: Media stored as static files + media table referencing URLs. R2 upload endpoint prepared but local uploads store base64 in D1-referenced /api/media (size-limited) to remain deployable without R2 binding.
Date: 2026-08-20
Status: Accepted
