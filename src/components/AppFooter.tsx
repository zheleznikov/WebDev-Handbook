"use client";

import {Text, Link as GLink} from '@gravity-ui/uikit';

export default function AppFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-line-mt mt-12 py-8">
            <div className="mx-auto w-full max-w-5xl px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                {/* Лого + название */}
                <div className="flex items-center gap-3">
                    <div
                        className="
                            w-8 h-8 rounded-md
                            bg-neutral-100 dark:bg-neutral-900
                            flex items-center justify-center
                            text-xs font-semibold tracking-wide
                            border border-line-mt
                        "
                    >
                        <Text variant="body-2">JS</Text>
                    </div>

                    <Text variant="body-2" color="primary">
                        JS Guide
                    </Text>
                </div>

                {/* Меню */}
                <nav className="flex flex-wrap gap-4">
                    <GLink href="/about" view="normal">
                        <Text variant="body-2">О проекте</Text>
                    </GLink>

                    <GLink href="/notes" view="normal">
                        <Text variant="body-2">Заметки</Text>
                    </GLink>

                    <GLink href="/privacy" view="normal">
                        <Text variant="body-2">Конфиденциальность</Text>
                    </GLink>

                    <GLink
                        href="https://github.com"
                        target="_blank"
                        rel="noreferrer"
                        view="normal"
                    >
                        <Text variant="body-2">GitHub</Text>
                    </GLink>
                </nav>
            </div>

            {/* Копирайт */}
            <div className="mt-6 text-center">
                <Text variant="body-short" color="secondary">
                    © {year} JS Guide — все права защищены
                </Text>
            </div>
        </footer>
    );
}
