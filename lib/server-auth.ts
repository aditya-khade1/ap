import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyCredentials } from "@/lib/data/users";
import { baseAuthConfig, sessionCallbacks } from "@/lib/auth";

/**
 * Server-side NextAuth entry. This extends the shared base config with the
 * credentials provider that authenticates the store admin against the
 * Netlify Database. It runs only in the Node.js runtime (API routes), never
 * in the Edge middleware.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...baseAuthConfig,
  callbacks: sessionCallbacks,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await verifyCredentials(
          String(credentials.email),
          String(credentials.password)
        );
        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
});
