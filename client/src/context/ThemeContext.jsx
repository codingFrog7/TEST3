import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
  isDark: false,
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("agro_sathi_theme");
      if (saved === "dark" || saved === "light") {
        return saved;
      }
    } catch {
      // fallback
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", "#1d1d1d");
    } else {
      root.classList.remove("dark");
      root.removeAttribute("data-theme");
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", "#eff0eb");
    }
    try {
      localStorage.setItem("agro_sathi_theme", theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
