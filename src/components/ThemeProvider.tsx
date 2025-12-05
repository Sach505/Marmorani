"use client";

import { createContext, useContext, useEffect, useCallback, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

// Mounted store to handle SSR/client hydration
const mountedStore = {
  mounted: false,
  listeners: new Set<() => void>(),
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  getSnapshot() {
    return mountedStore.mounted;
  },
  getServerSnapshot() {
    return false;
  },
  setMounted() {
    this.mounted = true;
    this.listeners.forEach((l) => l());
  },
};

// External store for theme to avoid setState in useEffect
function createThemeStore(storageKey: string, defaultTheme: Theme) {
  let currentTheme: Theme = defaultTheme;
  const listeners = new Set<() => void>();

  // Initialize from localStorage (client-side only)
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(storageKey) as Theme | null;
    if (stored && (stored === "light" || stored === "dark")) {
      currentTheme = stored;
    }
  }

  return {
    getSnapshot: () => currentTheme,
    getServerSnapshot: () => defaultTheme,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setTheme: (newTheme: Theme) => {
      currentTheme = newTheme;
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, newTheme);
      }
      listeners.forEach((listener) => listener());
    },
  };
}

// Global theme store singleton
let themeStoreInstance: ReturnType<typeof createThemeStore> | null = null;

function getThemeStore(storageKey: string, defaultTheme: Theme) {
  if (!themeStoreInstance) {
    themeStoreInstance = createThemeStore(storageKey, defaultTheme);
  }
  return themeStoreInstance;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "marmorani-theme",
}: ThemeProviderProps) {
  const store = getThemeStore(storageKey, defaultTheme);
  
  const theme = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );

  const mounted = useSyncExternalStore(
    mountedStore.subscribe.bind(mountedStore),
    mountedStore.getSnapshot,
    mountedStore.getServerSnapshot
  );

  // Mark as mounted after hydration - using layoutEffect pattern
  useEffect(() => {
    mountedStore.setMounted();
  }, []);

  // Apply theme class to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme, mounted]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      store.setTheme(newTheme);
    },
    [store]
  );

  const toggleTheme = useCallback(() => {
    store.setTheme(theme === "light" ? "dark" : "light");
  }, [theme, store]);

  // Prevent flash of incorrect theme
  if (!mounted) {
    return (
      <div style={{ visibility: "hidden" }}>
        {children}
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
