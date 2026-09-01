import { eq } from "drizzle-orm";
import { pbkdf2Sync, timingSafeEqual } from "crypto";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";

/**
 * Customers do not have accounts — they shop as guests.
 * Only the store admin authenticates.
 *
 * Admin accounts live in the `admin_users` table in the Netlify Database.
 * The table is seeded by a migration (netlify/database/migrations) with the
 * store operator's credentials. Passwords are stored exclusively as
 * PBKDF2-SHA256 hashes in the format:
 *   pbkdf2:sha256:<iterations>:<salt-base64>:<hash-base64>
 * produced by `node scripts/hash-admin-password.mjs "<password>"`.
 *
 * The plaintext password is never stored. If the table has no matching
 * account, sign-in is rejected.
 */

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
  const normalized = email.trim().toLowerCase();

  try {
    const rows = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, normalized))
      .limit(1);

    const account = rows[0];
    if (!account) return null;
    if (!verifyPasswordHash(password, account.passwordHash)) return null;

    return {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
    };
  } catch (error) {
    console.error("verifyCredentials: database lookup failed", error);
    return null;
  }
}

export type { AdminUserRow } from "@/db/schema";
