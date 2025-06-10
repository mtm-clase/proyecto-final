"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/Button"

export function ModeToggle() {
  const toggleTheme = () => {
    const html = document.documentElement
    const currentTheme = html.classList.contains("dark") ? "dark" : "light"
    html.classList.toggle("dark", currentTheme === "light")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title="Cambiar tema"
      hidden
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Cambiar tema</span>
    </Button>
  )
}