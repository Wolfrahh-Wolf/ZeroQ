"use client";

import { useEffect, useState } from "react";

export interface ToastMessage {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

const TOAST_EVENT = "zeroq:toast";

export function showToast(message: ToastMessage) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent<ToastMessage>(TOAST_EVENT, { detail: message }));
}

export function Toaster() {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const handleToast = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      setToast(event.detail as ToastMessage);
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => setToast(null), 6000);
    };
    window.addEventListener(TOAST_EVENT, handleToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, handleToast);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return <div aria-live="polite" aria-atomic="true" className="pointer-events-none fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-sm">
    {toast ? <div role={toast.variant === "destructive" ? "alert" : "status"} className={`pointer-events-auto rounded-md border bg-white p-4 shadow-fluent-4 ${toast.variant === "destructive" ? "border-red-300" : "border-slate-200"}`}>
      <p className={`text-sm font-semibold ${toast.variant === "destructive" ? "text-red-800" : "text-fluent-text-primary"}`}>{toast.title}</p>
      {toast.description ? <p className="mt-1 text-sm text-fluent-text-secondary">{toast.description}</p> : null}
    </div> : null}
  </div>;
}
