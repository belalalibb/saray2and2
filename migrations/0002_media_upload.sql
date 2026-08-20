-- ENG-020 — Device image uploads stored in D1 (base64) — works on free deploy without R2
ALTER TABLE media ADD COLUMN data TEXT;
