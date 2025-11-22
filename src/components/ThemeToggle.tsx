"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "wdh-theme";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<Theme | null>(null);

    // Инициализация темы
    useEffect(() => {
        if (typeof window === "undefined") return;

        const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;

        if (stored === "light" || stored === "dark") {
            setTheme(stored);
            document.documentElement.classList.toggle("dark", stored === "dark");
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const systemTheme: Theme = prefersDark ? "dark" : "light";
            setTheme(systemTheme);
            document.documentElement.classList.toggle("dark", systemTheme === "dark");
        }
    }, []);

    const toggleTheme = () => {
        if (!theme) return;

        const next: Theme = theme === "dark" ? "light" : "dark";
        setTheme(next);
        document.documentElement.classList.toggle("dark", next === "dark");
        window.localStorage.setItem(STORAGE_KEY, next);
    };

    // Пока не знаем тему — рендерим "скелет"
    if (!theme) {
        return (
            <button
                aria-label="Переключение темы"
                className="
          h-8 w-8 rounded-full border border-slate-200 bg-white/60
          dark:border-slate-600 dark:bg-slate-900/60
        "
            />
        );
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
            className="
        inline-flex h-8 w-8 items-center justify-center
        rounded-full border border-slate-200 bg-white/70
        text-slate-600 hover:bg-slate-100 hover:text-slate-900
        dark:border-slate-600 dark:bg-slate-900/80
        dark:text-slate-300 dark:hover:bg-slate-800
        transition
      "
        >
            {theme === "dark" ? "🌙" : "☀️"}
        </button>
    );
}
