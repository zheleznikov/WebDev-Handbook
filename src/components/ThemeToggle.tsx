"use client";

import {Switch} from "@gravity-ui/uikit";
import {useTheme} from "@/components/AppThemeProvider";

export function ThemeToggle() {
    const {theme, setTheme} = useTheme();

    return (
        <Switch
            checked={theme === "dark"}
            onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
            size="l"
        />
    );
}
