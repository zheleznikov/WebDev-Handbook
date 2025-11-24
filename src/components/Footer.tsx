"use client";

import { Flex, Link, Text, } from "@gravity-ui/uikit";
import { GithubIcon } from "lucide-react";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t px-4 py-6 mt-6">
            <Flex
                justifyContent="space-between"
                alignItems="center"
                className="max-w-4xl mx-auto gap-4 flex flex-col items-center text-center gap-3
                    sm:flex-row sm:items-center sm:justify-between sm:text-left"
            >
                <Link
                    href="https://github.com/zheleznikov/WebDev-Handbook/blob/master/README.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-lg font-medium"
                >
                    Добавить статью
                    <GithubIcon width={20} height={20} />
                </Link>

                <Text
                variant={"code-2"}>
                    {`Сергей Железников • ${year}`}
                </Text>
            </Flex>
        </footer>
    );
}
