import "./globals.css";
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import "./gravity-styles.css";
import Header from "@/components/Header";
import { AppThemeProvider } from "@/components/AppThemeProvider";
import { cookies } from "next/headers";
import { getRootClassName } from "@gravity-ui/uikit/server";
import Footer from "@/components/Footer";


export const metadata = {
    title: "Handbook",
    icons: {
        icon: "/favicon.png",
    }
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const cookieStore = await cookies();
    const themeCookie = cookieStore.get("theme")?.value as "light" | "dark" | undefined;

    const initialTheme: "light" | "dark" =
        themeCookie === "dark" ? "dark" : "light";

    const gravityTheme = initialTheme === "dark" ? "dark-hc" : "light-hc";

    const rootClassName = getRootClassName({theme: gravityTheme});

    return (
        <html
            lang="ru"
            className={`${initialTheme === "dark" ? "dark" : ""}`}
            suppressHydrationWarning
        >
        <body className={rootClassName}>
        <AppThemeProvider initialTheme={initialTheme}>
            <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-neutral-900">
                <Header />
                <main className="pt-8  flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        </AppThemeProvider>
        </body>
        </html>
    );
}
