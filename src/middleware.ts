import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * ZeroQ Route Protection Middleware
 *
 * Protects /dashboard/* (STUDENT only) and /admin/* (ADMIN only).
 * Unauthenticated users are redirected to /login by the withAuth callback.
 * Authenticated users accessing the wrong portal are redirected to their correct one.
 */
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Authenticated user accessing admin portal but is a STUDENT
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Authenticated user accessing student portal but is an ADMIN
    if (pathname.startsWith("/dashboard") && token?.role !== "STUDENT") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // Allow request to proceed
    return NextResponse.next();
  },
  {
    callbacks: {
      // withAuth: Only allow the middleware function to run if a valid token exists.
      // If no token, withAuth automatically redirects to the configured signIn page (/login).
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
