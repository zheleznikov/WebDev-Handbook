"use client";

import {Text, Link,} from "@gravity-ui/uikit";

export default function AppFooter() {
    const year = new Date().getFullYear();

    return (
        <footer
            className="
               py-8
                border-t border-color-misc-border
                flex justify-center
            "
        >
            <div className="flex items-center gap-2 text-center">

                <Link
                    href="https://github.com/zheleznikov/WebDev-Handbook"
                    target="_blank"
                    view="secondary"
                >
                    Добавить статью
                </Link>

                <Text variant="body-2" color="secondary">
                    · © {year}
                </Text>
            </div>
        </footer>
    );
}
