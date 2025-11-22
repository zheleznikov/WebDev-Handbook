import "./globals.css";
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
        <body
            className="
          min-h-screen
          bg-stone-50 text-slate-900
          dark:bg-slate-950 dark:text-slate-50
        "
        >
        <Header />
        <main className="pt-16">
            {children}
        </main>
        </body>
        </html>
    );
}
