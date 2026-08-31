import { pbkdf2Sync, timingSafeEqual } from "crypto";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin";
}

/**
 * Customers do not have accounts — they shop as guests.
 * Only the store admin authenticates.
 *
 * Admin credentials are provided exclusively through environment variables:
 *   ADMIN_EMAIL            admin email (e.g. admin@apfashionmart.com)
 *   ADMIN_PASSWORD_HASH    PBKDF2-SHA256 hash of the admin password, generated with:
 *                          node scripts/hash-admin-password.mjs "<password>"
 *
 * No password is ever stored in source code. If either variable is missing,
 * admin sign-in is disabled.
 */
const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH ?? "";

/**
 * Constant-time verification of a password against a PBKDF2-SHA256 hash in the format:
 * `pbkdf2:sha256:<iterations>:<salt-base64>:<hash-base64>`
 */
function verifyPasswordHash(password: string, stored: string): boolean {
  const parts = stored.split(":");
  if (parts.length !== 5) return false;
  const [, algo, iterationsStr, saltB64, hashB64] = parts;
  if (algo !== "sha256") return false;

  const iterations = parseInt(iterationsStr, 10);
  if (!Number.isFinite(iterations) || iterations <= 0) return false;

  const salt = Buffer.from(saltB64, "base64");
  const expected = Buffer.from(hashB64, "base64");
  if (expected.length === 0) return false;

  const actual = pbkdf2Sync(password, salt, iterations, expected.length, "sha256");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function verifyCredentials(email: string, password: string) {
  if (!adminEmail || !adminPasswordHash) return null;
  if (email.trim().toLowerCase() !== adminEmail) return null;
  if (!verifyPasswordHash(password, adminPasswordHash)) return null;

  return {
    id: "admin-1",
    name: "Admin",
    email: adminEmail,
    role: "admin" as const,
  };
}

export function ensureSeededAdmin() {
  // Admin is configured entirely via environment variables; nothing to seed.
  return;
}

// Kept for parity with any tooling that expects a users list (no secrets included).
export function getUsers() {
  return [
    {
      id: "admin-1",
      name: "Admin",
      email: adminEmail || "admin",
      role: "admin" as const,
    },
  ];
}

export type { AdminUser };