import { cn } from "@/lib/utils";
export function Toast({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div role="status" className={cn("rounded-md border border-slate-200 bg-white p-4 text-sm text-fluent-text-primary shadow-lg", className)} {...props} />; }
export function ToastTitle({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) { return <p className={cn("font-semibold", className)} {...props} />; }
export function ToastDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) { return <p className={cn("text-sm text-fluent-text-secondary", className)} {...props} />; }
