import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }
  interface User {
    role?: string;
  }
}

/**
 * Base NextAuth configuration. The credentials provider's `authorize` hook is
 * injected by the server entry (lib/server-auth.ts) so that this file stays
 * free of Node-only/database imports and can be bundled into the Edge runtime
 * (middleware) as well.
 */
export const baseAuthConfig: NextAuthConfig = {
  trustHost: true,
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "ap-fashion-mart-local-secret-2026",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  providers: [],
};

export const sessionCallbacks: NextAuthConfig["callbacks"] = {
  async jwt({ token, user }) {
    if (user) {
      token.role = (user as { role?: string }).role;
      token.id = user.id;
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.role = token.role as string;
      session.user.id = token.id as string;
    }
    return session;
  },
};
