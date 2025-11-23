"use client";

import {useState} from "react";
import {Button, Text, Tooltip} from "@gravity-ui/uikit";
import {Share2, CheckCircle, XCircle} from "lucide-react";

type ShareButtonProps = {
    title: string;
    description?: string;
};

export function ShareButton({title, description}: ShareButtonProps) {
    const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

    async function handleClick() {
        try {
            const url = window.location.href;

            // Web Share API
            if (navigator.share) {
                await navigator.share({
                    title,
                    text: description || title,
                    url,
                });
                setStatus("idle");
                return;
            }

            // Copy fallback
            await navigator.clipboard.writeText(url);
            setStatus("copied");
            setTimeout(() => setStatus("idle"), 2200);
        } catch (e) {
            console.error(e);
            setStatus("error");
            setTimeout(() => setStatus("idle"), 2200);
        }
    }

    const iconColor = "var(--g-color-text-secondary)";

    return (
        <div className="flex items-center gap-2">
            <Tooltip
                content={
                    status === "copied"
                        ? "Ссылка скопирована"
                        : status === "error"
                            ? "Не удалось поделиться"
                            : "Поделиться"
                }
            >
                <Button
                    size="s"
                    view="flat"
                    onClick={handleClick}
                    disabled={status === "copied"}
                >
                    {status === "idle" && (
                        <Share2 size={16} strokeWidth={1.75} color={iconColor} />
                    )}

                    {status === "copied" && (
                        <CheckCircle size={16} strokeWidth={1.75} color="var(--g-color-text-positive)" />
                    )}

                    {status === "error" && (
                        <XCircle size={16} strokeWidth={1.75} color="var(--g-color-text-danger)" />
                    )}
                </Button>
            </Tooltip>

            {/* Текст статуса рядом */}
            {status === "copied" && (
                <Text variant="body-3" color="positive">
                    Ссылка скопирована
                </Text>
            )}

            {status === "error" && (
                <Text variant="body-3" color="danger">
                    Не удалось поделиться
                </Text>
            )}
        </div>
    );
}
