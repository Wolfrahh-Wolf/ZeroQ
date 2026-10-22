import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * NextAuth.js API Route Handler
 * Handles all NextAuth requests: sign-in, sign-out, session, CSRF, etc.
 *
 * Route: /api/auth/[...nextauth]
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
