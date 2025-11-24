"use client";

import { usePathname } from "next/navigation";
import { Flex, Link, Text, Icon } from "@gravity-ui/uikit";
import { ArrowLeft } from "@gravity-ui/icons";
import React from "react";
import { HeaderThemeToggle } from "@/components/HeaderThemeToggle";

export default function Header() {
    const pathname = usePathname();
    const isHome = pathname === "/";

    return (
        <div
            className="
                fixed top-0 left-0 right-0 z-30
                backdrop-blur-md
                border-b
                px-4 sm:px-6 py-3
            "
        >
            <Flex
                justifyContent="space-between"
                alignItems="center"
                className="max-w-4xl mx-auto gap-4"
            >
                <div className={isHome ? "invisible" : "visible"}>
                    <Link href="/">
                        <ArrowLeft fontSize={18} />
                    </Link>
                </div>

                <Flex alignItems="center" gap={3}>
                    <Text variant="header-1" as="h1" color="primary">
                        Справочник по JS
                    </Text>
                </Flex>

                <HeaderThemeToggle />
            </Flex>
        </div>
    );
}
