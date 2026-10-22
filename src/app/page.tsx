import { redirect } from "next/navigation";

/**
 * Root page — immediately redirects to /login.
 * After authentication, NextAuth middleware handles
 * role-based routing to /dashboard or /admin.
 */
export default function RootPage() {
  redirect("/login");
}
