import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group active:scale-[0.98] min-h-[48px]",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 rounded-xl border border-blue-500/20 hover:border-blue-400/30 backdrop-blur-sm",
        destructive: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl hover:shadow-red-500/25 rounded-xl border border-red-400/20 hover:border-red-300/30",
        outline: "border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-900 dark:text-gray-100 rounded-xl backdrop-blur-sm hover:shadow-lg transition-all duration-300",
        secondary: "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 text-gray-900 dark:text-gray-100 rounded-xl shadow-sm hover:shadow-md border border-gray-200/50 dark:border-gray-600/50",
        ghost: "text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100 rounded-xl transition-all duration-200 hover:shadow-sm",
        link: "text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200",
        glass: "bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-white/10 text-foreground hover:bg-white/20 dark:hover:bg-black/20 hover:border-white/30 dark:hover:border-white/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300",
        primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 rounded-xl border border-blue-500/20 hover:border-blue-400/30 backdrop-blur-sm",
        neon: "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 rounded-xl border border-cyan-400/20 hover:border-cyan-300/30 relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-400/20 before:to-blue-400/20 before:rounded-xl before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
      },
      size: {
        default: "h-12 px-6 py-2.5 text-sm",
        sm: "h-10 px-4 py-2 text-xs",
        lg: "h-14 px-8 py-3 text-base font-semibold",
        icon: "h-12 w-12",
        xl: "h-16 px-10 py-4 text-lg font-bold",
        touch: "h-12 min-h-[48px] px-4 rounded-xl font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
