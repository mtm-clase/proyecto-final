import { cn } from "@/lib/utils"

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function Layout({ children, className, ...props }: LayoutProps) {
  return (
    <div className="bg-[#030712] min-h-screen">
      <main className={`container mx-auto px-4 py-8 min-h-screen flex items-center justify-center ${className}`} {...props}>
        {children}
      </main>
    </div>
  )
}

interface LayoutHeaderProps {
  children: React.ReactNode
  className?: string
}

Layout.Header = function LayoutHeader({ children, className }: LayoutHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      {children}
    </div>
  )
}