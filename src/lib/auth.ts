import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/lib/types";

/**
 * NextAuth.js Configuration
 *
 * Strategy: JWT (not database sessions — avoids adapter conflicts with Supabase pooling)
 * Provider: Credentials (Email + Password)
 * Token fields: id, name, email, role, outletId
 *
 * Role-based routing handled in src/middleware.ts
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Fetch user from DB (include password for bcrypt comparison)
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: true,
            outletId: true,
          },
        });

        if (!user) return null;

        const passwordValid = await bcrypt.compare(credentials.password, user.password);
        if (!passwordValid) return null;

        // Return object passed to jwt callback (must match NextAuth User type)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          outletId: user.outletId ?? null,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, user object is available — persist custom fields to token
      if (user) {
        const u = user as SessionUser & { id: string };
        token.id = u.id;
        token.role = u.role;
        token.outletId = u.outletId ?? null;
      }
      return token;
    },

    async session({ session, token }) {
      // Expose token fields to the session object accessible client-side
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "STUDENT" | "ADMIN";
        session.user.outletId = (token.outletId as string | null) ?? null;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allow relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * TypeScript: Extend NextAuth types to include custom session fields.
 * This augmentation allows TypeScript to know about id, role, and outletId
 * on the session.user object without casting.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "STUDENT" | "ADMIN";
      outletId: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "STUDENT" | "ADMIN";
    outletId: string | null;
  }
}
