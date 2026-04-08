import * as React from "react"
import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

import { Slot } from "radix-ui"

import { cn } from "@/shared/lib"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md whitespace-nowrap tracking-normal transition-all outline-none focus-visible:border-[var(--ring)] focus-visible:ring-[3px] focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-[var(--destructive)] aria-invalid:ring-[var(--destructive)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[color-mix(in_oklab,var(--primary),black_10%)]",
        delete:
          "border border-gray-300 text-red-500 cursor-pointer hover:bg-red-50 hover:text-red-700 [&_svg]:size-6",
      },
      size: {
        default: "h-9 px-4 py-2 text-base font-semibold has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs font-semibold has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 text-sm font-semibold has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 text-base font-semibold has-[>svg]:px-4",
        icon: "size-4",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-24",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    compoundVariants: [
      {
        variant: "delete",
        size: "default",
        className: "size-12 rounded-full p-0",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
