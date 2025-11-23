"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";


import {Card, Flex, Text} from "@gravity-ui/uikit";
import React from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
    const pathname = usePathname();
    const isHome = pathname === "/";

    return (
        <Card
            view="filled"
            className="
                fixed top-0 left-0 right-0 z-30
                backdrop-blur-md
                px-4 sm:px-6 py-3
                border-b
            "
        >
            <Flex
                justifyContent="space-between"
                alignItems="center"
                className="max-w-4xl mx-auto gap-4"
            >

                {isHome ? (
                    <div className="w-[110px]" />
                ) : (
                    <Link
                        href="/"
                        className="
                            w-[110px] inline-block
                            text-sm
                            text-slate-700 hover:text-slate-900
                            transition
                        "
                    >
                        ← На главную
                    </Link>
                )}

                <Flex alignItems="center" gap={3}>
                    <Text variant="body-2" color="secondary">
                        WebDev Handbook
                    </Text>
                    <ThemeToggle />
                </Flex>
            </Flex>
        </Card>
    );
}
