"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Text toggle rather than a sun/moon glyph. Interchangeable line icons are one
 * of the clearest machine-generated tells, so the whole page avoids them.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const dark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
    >
      {mounted ? (dark ? "Light" : "Dark") : <span className="opacity-0">Dark</span>}
    </button>
  );
}
