"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
    const pathname = usePathname();
    const isHome = pathname === "/";

    return (
        <header
            className="
        fixed top-0 left-0 right-0 z-30
        backdrop-blur-md
        bg-white/70 border-b border-slate-200
        dark:bg-slate-900/80 dark:border-slate-700
        px-4 sm:px-6 py-3
      "
        >
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">

                {/* Левая часть — либо кнопка, либо заглушка */}
                {isHome ? (
                    <div className="w-[110px]" />
                ) : (
                    <Link
                        href="/"
                        className="
              w-[110px] inline-block text-sm font-medium
              text-slate-700 hover:text-slate-900
              dark:text-slate-200 dark:hover:text-white
              transition
            "
                    >
                        ← На главную
                    </Link>
                )}

                {/* Правая часть: текст + переключатель темы */}
                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-300">
                    <span>WebDev Handbook</span>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
