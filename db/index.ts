import { drizzle } from "drizzle-orm/netlify-db";
import * as schema from "./schema";

/**
 * Netlify Database injects NETLIFY_DB_URL. In some environments (e.g. the
 * local Netlify dev server) the injected URL omits the user part, which the
 * Postgres driver rejects ("user is required"). Normalizing it here keeps the
 * same code path working in dev and in production, where no change is needed.
 */
function normalizeNetlifyDbUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  if (url.includes("@")) return url;
  return url.replace("postgres://", "postgres://postgres@");
}

if (
  process.env.NETLIFY_DB_DRIVER !== "serverless" &&
  process.env.NETLIFY_DB_URL &&
  !process.env.NETLIFY_DB_URL.includes("@")
) {
  process.env.NETLIFY_DB_URL = normalizeNetlifyDbUrl(process.env.NETLIFY_DB_URL);
}

export const db = drizzle({ schema });
