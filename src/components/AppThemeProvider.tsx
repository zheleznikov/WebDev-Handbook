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
    const [theme, setTheme] = useState<Theme>(initialTheme);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
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
