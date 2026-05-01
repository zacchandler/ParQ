"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40",
  {
    variants: {
      variant: {
        primary: "bg-magenta-500 text-white hover:bg-magenta-600 shadow-[0_8px_24px_-8px_rgb(233_30_99_/_0.55)]",
        purple: "bg-purple-600 text-white hover:bg-purple-700 shadow-[0_8px_24px_-8px_rgb(107_47_179_/_0.55)]",
        outline: "border-2 border-purple-600 text-purple-600 bg-transparent hover:bg-purple-50",
        ghost: "bg-transparent text-purple-600 hover:bg-purple-50",
        soft: "bg-purple-100 text-purple-700 hover:bg-purple-200",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-[15px]",
        lg: "h-14 px-6 text-base",
        xl: "h-16 px-8 text-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type MotionButtonProps = HTMLMotionProps<"button">;

export interface ButtonProps extends Omit<MotionButtonProps, "ref">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot ref={ref} className={cn(buttonVariants({ variant, size }), className)}>
          {children as React.ReactElement}
        </Slot>
      );
    }
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        whileHover={{ y: -1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
