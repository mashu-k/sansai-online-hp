"use client";
import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex h-8 w-14 items-center rounded-full bg-muted/60 hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <span
        className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-background shadow-sm transition-transform duration-300 ${
          isDark ? "translate-x-6" : "translate-x-0"
        }`}
      />
      <span className="absolute left-2 text-muted-foreground">
        <Moon className="h-4 w-4" />
      </span>
      <span className="absolute right-2 text-accent">
        <Sun className="h-4 w-4" />
      </span>
      <span className="sr-only">テーマを切り替える</span>
    </button>
  );
}
