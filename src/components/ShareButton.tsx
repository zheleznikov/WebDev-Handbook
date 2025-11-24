"use client";

import { useState } from "react";
import { Button, Tooltip } from "@gravity-ui/uikit";
import { ArrowShapeTurnUpRight } from '@gravity-ui/icons';

type ShareButtonProps = {
    title: string;
    description?: string;
};

export function ShareButton({title, description}: ShareButtonProps) {
    const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

    async function handleClick() {
        try {
            const url = window.location.href;

            if (navigator.share) {
                await navigator.share({
                    title,
                    text: description || title,
                    url,
                });
                setStatus("idle");
                return;
            }

            await navigator.clipboard.writeText(url);
            setStatus("copied");
            setTimeout(() => setStatus("idle"), 2200);
        } catch (e) {
            console.error(e);
            setStatus("error");
            setTimeout(() => setStatus("idle"), 2200);
        }
    }


    return (
        <div className="flex">
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
                    size="m"
                    view="flat"
                    onClick={handleClick}
                    disabled={status === "copied"}
                    className="
                p-2
                aspect-square
                flex items-center justify-center
                rounded-lg
                hover:bg-[var(--g-color-base-simple-hover)]
                active:bg-[var(--g-color-base-simple-active)]
            "
                >
                    <ArrowShapeTurnUpRight className="h-5 w-5" />
                </Button>
            </Tooltip>

        </div>
    );
}
