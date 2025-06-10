"use client"

import * as React from "react"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: "system" | "dark" | "light"
  storageKey?: string
}

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "vite-ui-theme" }: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<"system" | "dark" | "light">(defaultTheme)

  React.useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as "system" | "dark" | "light" | null
    if (storedTheme) {
      setTheme(storedTheme)
    } else {
      setTheme(defaultTheme)
    }
  }, [defaultTheme, storageKey])

  React.useEffect(() => {
    if (theme === "system") {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.remove("light")
    } else if (theme === "dark") {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
    }
    if (theme !== "system") {
      localStorage.setItem(storageKey, theme)
    } else {
      localStorage.removeItem(storageKey)
    }
  }, [theme, storageKey])

  return <React.Fragment>{children}</React.Fragment>
}

