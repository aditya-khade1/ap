import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Admin accounts for the store dashboard. Customers shop as guests and never
 * have accounts — only the store operator signs in at /auth/login.
 *
 * Passwords are stored exclusively as PBKDF2-SHA256 hashes in the format
 * `pbkdf2:sha256:<iterations>:<salt-base64>:<hash-base64>` (same format the
 * scripts/hash-admin-password.mjs helper emits). Plaintext is never stored.
 */
export const adminUsers = pgTable("admin_users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type AdminUserRow = typeof adminUsers.$inferSelect;
