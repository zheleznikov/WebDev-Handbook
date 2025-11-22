// src/components/ShareButton.tsx
"use client";

import { useState } from "react";
import { Share, Share2 } from "lucide-react";

type ShareButtonProps = {
    title: string;
    description?: string;
};

export function ShareButton({title, description}: ShareButtonProps) {
    const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

    async function handleClick() {
        try {
            const url = window.location.href;

            // Если доступен Web Share API
            if (navigator.share) {
                await navigator.share({
                    title,
                    text: description || title,
                    url,
                });
                setStatus("idle");
                return;
            }

            // Фолбэк: копируем ссылку
            await navigator.clipboard.writeText(url);
            setStatus("copied");
            setTimeout(() => setStatus("idle"), 2000);
        } catch (e) {
            console.error(e);
            setStatus("error");
            setTimeout(() => setStatus("idle"), 2000);
        }
    }

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={handleClick}
                className="
                inline-flex items-center gap-1.5
                rounded-full border border-slate-200 bg-white/80
                px-3 py-1.5 text-xs font-medium text-slate-700
                shadow-sm
                hover:border-slate-300 hover:bg-white
                active:scale-[0.99]
                transition

                dark:border-slate-600 dark:bg-slate-800/70
                dark:text-slate-300
                dark:hover:bg-slate-800 dark:hover:border-slate-500
            "
            >
                Поделиться
                <Share
                    size={14}
                    className="text-slate-500 dark:text-slate-400"
                />
            </button>

            {status === "copied" && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                Ссылка скопирована
            </span>
            )}

            {status === "error" && (
                <span className="text-[11px] text-red-500 dark:text-red-400">
                Не удалось поделиться
            </span>
            )}
        </div>
    );
}
