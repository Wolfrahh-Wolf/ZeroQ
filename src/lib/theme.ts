// ─── Theme utilities ────────────────────────────────────────────────────────
// Shared constants so the storage key and theme values are never mismatched
// between server and client code.

export const THEME_STORAGE_KEY = "zeroq-theme" as const;
export type Theme = "dark" | "light";

/**
 * Reads the persisted theme preference from localStorage (browser-only).
 * Falls back to the OS prefers-color-scheme, then to "dark" as the default.
 */
export function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // localStorage may be blocked (private mode, etc.) — fall through.
  }

  if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
  return "dark";
}

/**
 * Applies the given theme by toggling the `.dark` class on <html>.
 * Also persists the choice to localStorage.
 */
export function applyTheme(theme: Theme, persist = true): void {
  const html = document.documentElement;
  if (theme === "dark") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Silently swallow — preference just won't persist.
    }
  }
}
