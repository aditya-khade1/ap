-- Seed the store admin account. The password hash uses the PBKDF2-SHA256
-- format produced by scripts/hash-admin-password.mjs; the plaintext password
-- is never stored anywhere.
INSERT INTO "admin_users" ("id", "name", "email", "password_hash", "role")
VALUES ('admin-1', 'Admin', 'admin@apfashionmart.com', 'pbkdf2:sha256:310000:Bm1OxTOtGv8+s16+r5S+Cg==:b35Wqyb2iBASyL7eXq3t0pt7JmNG/iW5XSPsTzkl7Hk=', 'admin')
ON CONFLICT ("id") DO UPDATE
SET "name" = EXCLUDED."name",
    "email" = EXCLUDED."email",
    "password_hash" = EXCLUDED."password_hash",
    "role" = EXCLUDED."role";
