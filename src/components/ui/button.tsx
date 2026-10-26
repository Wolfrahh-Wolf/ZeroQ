import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-fluent-brand-primary text-white hover:bg-fluent-brand-hover dark:bg-[#479ef5] dark:hover:bg-[#62abf5] dark:text-[#1a1a1a]",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600",
        outline:
          "border border-fluent-neutral-stroke-2 bg-white hover:bg-fluent-neutral-bg-3 dark:border-[#525252] dark:bg-[#252525] dark:text-[#f5f5f5] dark:hover:bg-[#333333]",
        secondary:
          "bg-fluent-neutral-bg-3 text-fluent-text-primary hover:bg-fluent-neutral-stroke dark:bg-[#333333] dark:text-[#f5f5f5] dark:hover:bg-[#3d3d3d]",
        ghost:
          "hover:bg-fluent-neutral-bg-3 dark:hover:bg-[#333333] dark:text-[#f5f5f5]",
        link: "text-fluent-brand-primary underline-offset-4 hover:underline dark:text-[#479ef5]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";
