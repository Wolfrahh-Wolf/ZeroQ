import { cn } from "@/lib/utils";
export function Toast({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div role="status" className={cn("rounded-md border border-slate-200 bg-white p-4 text-sm text-fluent-text-primary shadow-lg dark:border-[#3d3d3d] dark:bg-[#252525] dark:text-[#f5f5f5]", className)} {...props} />; }
export function ToastTitle({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) { return <p className={cn("font-semibold text-fluent-text-primary dark:text-[#f5f5f5]", className)} {...props} />; }
export function ToastDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) { return <p className={cn("text-sm text-fluent-text-secondary dark:text-[#adadad]", className)} {...props} />; }
