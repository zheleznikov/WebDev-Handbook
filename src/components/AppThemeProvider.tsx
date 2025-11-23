// src/components/AppThemeProvider.tsx
"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import {ThemeProvider as GravityThemeProvider} from "@gravity-ui/uikit";

type Theme = "light" | "dark";

type ThemeContextValue = {
    theme: Theme;
    setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme must be used inside AppThemeProvider");
    }
    return ctx;
}

export function AppThemeProvider({
    children,
    initialTheme,
}: {
    children: React.ReactNode;
    initialTheme: Theme;
}) {
    // ❗ стартуем с темы, пришедшей с сервера
    const [theme, setTheme] = useState<Theme>(initialTheme);

    useEffect(() => {
        // Tailwind .dark
        document.documentElement.classList.toggle("dark", theme === "dark");

        // localStorage — чтобы клиент тоже знал
        try {
            localStorage.setItem("theme", theme);
        } catch {}

        // cookie — чтобы сервер знал при следующем запросе
        document.cookie = `theme=${theme}; path=/; max-age=31536000`;
    }, [theme]);

    const gravityTheme = theme === "dark" ? "dark-hc" : "light-hc";

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            <GravityThemeProvider theme={gravityTheme} lang="ru">
                {children}
            </GravityThemeProvider>
        </ThemeContext.Provider>
    );
}
