"use client";

import { Button, Flex, Tooltip } from "@gravity-ui/uikit";
import { ArrowShapeTurnUpRight } from '@gravity-ui/icons';

type ShareButtonProps = {
    title: string;
    description?: string;
};

export function ShareButton({title, description}: ShareButtonProps) {

    async function handleClick() {
        try {
            const url = window.location.href;

            if (navigator.share) {
                await navigator.share({
                    title,
                    text: description || title,
                    url,
                });
                return;
            }

            await navigator.clipboard.writeText(url);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <Flex>
            <Tooltip content="Поделиться">
                <Button
                    size="m"
                    view="flat"
                    onClick={handleClick}
                    className="flex items-center justify-center"
                >
                    <ArrowShapeTurnUpRight className="h-5 w-5" />
                </Button>
            </Tooltip>
        </Flex>
    );
}
