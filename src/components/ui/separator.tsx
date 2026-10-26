"use client";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";
export const Separator = ({ className, orientation = "horizontal", decorative = true, ...props }: React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>) => (
  <SeparatorPrimitive.Root decorative={decorative} orientation={orientation} className={cn("shrink-0 bg-fluent-neutral-stroke dark:bg-[#3d3d3d]", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className)} {...props} />
);
