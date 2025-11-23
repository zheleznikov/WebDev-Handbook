"use client";

import {useEffect, useState} from "react";
import {Button} from "@gravity-ui/uikit";

type Theme = "light" | "dark";

function getSystemTheme(): Theme {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>("light");

    // Инициализация темы на клиенте
    useEffect(() => {
        if (typeof window === "undefined") return;

        const stored = window.localStorage.getItem("theme");
        const initial: Theme =
            stored === "light" || stored === "dark" ? stored : getSystemTheme();

        setTheme(initial);

        const root = document.documentElement;
        if (initial === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => {
            const next: Theme = prev === "dark" ? "light" : "dark";

            const root = document.documentElement;
            if (next === "dark") {
                root.classList.add("dark");
            } else {
                root.classList.remove("dark");
            }

            window.localStorage.setItem("theme", next);
            return next;
        });
    };

    const isDark = theme === "dark";

    return (
        <Button
            size="s"
            view="flat"
            onClick={toggleTheme}
        >
            <span aria-hidden="true" className="mr-1">
                {isDark ? "🌙" : "☀️"}
            </span>
            {isDark ? "Тёмная" : "Светлая"}
        </Button>
    );
}
