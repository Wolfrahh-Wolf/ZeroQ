"use client";

import { FormEvent, useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (!result || result.error) {
        setError("The email or password you entered is incorrect.");
        return;
      }
      const session = await getSession();
      const destination = session?.user.role === "ADMIN" ? "/admin" : "/dashboard";
      router.replace(destination);
      router.refresh();
    } catch {
      setError("We couldn't sign you in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-fluent-neutral-bg-3 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-fluent-brand-primary text-white shadow-fluent-4">
            <Utensils aria-hidden="true" className="h-7 w-7" />
          </div>
          <p className="text-2xl font-semibold tracking-tight text-fluent-text-primary">ZeroQ</p>
          <p className="mt-1 text-sm text-fluent-text-secondary">Skip the queue. Make every minute count.</p>
        </div>

        <Card>
          <CardHeader className="space-y-2 pb-5">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Sign in with your campus account to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" name="email" type="email" autoComplete="username" placeholder="you@campus.edu" required value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required value={password} onChange={(event) => setPassword(event.target.value)} />
              </div>
              {error ? <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in…" : "Sign in"}
                {!isSubmitting ? <ArrowRight aria-hidden="true" className="h-4 w-4" /> : null}
              </Button>
            </form>
            <p className="mt-6 text-center text-xs leading-5 text-fluent-text-secondary">Your account determines whether you enter the student portal or outlet dashboard.</p>
          </CardContent>
        </Card>
        <p className="mt-6 text-center text-xs text-fluent-text-secondary">Campus dining, on your time.</p>
      </div>
    </main>
  );
}
