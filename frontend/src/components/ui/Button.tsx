import React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg" | "icon"
  isLoading?: boolean
  colorScheme?: "cyan" | "purple" | "emerald" | "red"
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", isLoading, colorScheme = "cyan", asChild = false, children, ...props }, ref) => {
    const baseStyles = "rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-50"
    
    const variants = {
      default: `text-white ${
        colorScheme === "cyan" ? "bg-cyan-600 hover:bg-cyan-700" :
        colorScheme === "purple" ? "bg-purple-600 hover:bg-purple-700" :
        colorScheme === "emerald" ? "bg-emerald-600 hover:bg-emerald-700" :
        colorScheme === "red" ? "bg-red-600 hover:bg-red-700" :
        "bg-gray-600 hover:bg-gray-700"
      }`,
      outline: `border-2 bg-transparent ${
        colorScheme === "cyan" ? "border-cyan-600 text-cyan-600 hover:bg-cyan-600/10" :
        colorScheme === "purple" ? "border-purple-600 text-purple-600 hover:bg-purple-600/10" :
        colorScheme === "emerald" ? "border-emerald-600 text-emerald-600 hover:bg-emerald-600/10" :
        colorScheme === "red" ? "border-red-600 text-red-600 hover:bg-red-600/10" :
        "border-gray-600 text-gray-600 hover:bg-gray-600/10"
      }`,
      ghost: `bg-transparent ${
        colorScheme === "cyan" ? "text-cyan-600 hover:bg-cyan-600/10" :
        colorScheme === "purple" ? "text-purple-600 hover:bg-purple-600/10" :
        colorScheme === "emerald" ? "text-emerald-600 hover:bg-emerald-600/10" :
        colorScheme === "red" ? "text-red-600 hover:bg-red-600/10" :
        "text-gray-600 hover:bg-gray-600/10"
      }`
    }

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg",
      icon: "p-2"
    }

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isLoading && "opacity-50 cursor-not-allowed",
          className
        )}
        disabled={isLoading || props.disabled}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="ml-2">{children}</span>
          </div>
        ) : (
          children
        )}
      </button>
    )
  }
)