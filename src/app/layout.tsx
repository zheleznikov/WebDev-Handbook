import "./globals.css";
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import {ThemeProvider} from '@gravity-ui/uikit';
import { Inter } from "next/font/google";
import Header from "@/components/Header";

const inter = Inter({
    subsets: ["latin", "cyrillic"],
});

export const metadata = { title: "JS Guide" };


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="ru"
            className={inter.className}
            suppressHydrationWarning
        >
        <body>
        {/* Gravity UI управляет темой внутри */}
        <ThemeProvider theme="system" lang="ru">
            <div
                className="
                    min-h-screen
                    bg-stone-50 text-slate-900
                    /* если захочешь использовать tailwind-тёмную тему, можно оставить:
                    dark:bg-slate-950 dark:text-slate-50
                    и дальше уже управлять классом .dark на html
                    */
                "
            >
                <Header />
                <main className="pt-16">
                    {children}
                </main>
            </div>
        </ThemeProvider>
        </body>
        </html>
    );
}
