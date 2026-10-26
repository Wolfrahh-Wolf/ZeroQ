import * as React from "react";
import { cn } from "@/lib/utils";
export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, type, ...props }, ref) => (
  <input type={type} className={cn("flex h-10 w-full rounded-md border border-fluent-neutral-stroke-2 bg-white px-3 py-2 text-sm text-fluent-text-primary placeholder:text-fluent-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#525252] dark:bg-[#252525] dark:text-[#f5f5f5] dark:placeholder:text-[#6e6e6e]", className)} ref={ref} {...props} />
));
Input.displayName = "Input";
