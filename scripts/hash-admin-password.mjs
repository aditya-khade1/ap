import { pbkdf2Sync, randomBytes } from "node:crypto";

const password = process.argv[2];

if (!password) {
  console.error(
    'Usage: node scripts/hash-admin-password.mjs "<password>"\n' +
      "Prints ADMIN_PASSWORD_HASH=<salt>:<iterations>:<salt-b64>:<hash-b64> to paste into your environment."
  );
  process.exit(1);
}

if (password.length < 12) {
  console.error("Password must be at least 12 characters long.");
  process.exit(1);
}

const iterations = 310000;
const salt = randomBytes(16);
const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256");

console.log(
  ["ADMIN_PASSWORD_HASH", "pbkdf2", "sha256", String(iterations), salt.toString("base64"), hash.toString("base64")].join(":")
);