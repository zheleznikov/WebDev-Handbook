"use client";

import {Switch} from "@gravity-ui/uikit";
import {useTheme} from "@/components/AppThemeProvider";

export function HeaderThemeToggle() {
    const {theme, setTheme} = useTheme();

    return (
        <Switch
            checked={theme === "dark"}
            onChange={(e) => {
                const checked = e.target.checked;
                setTheme(checked ? "dark" : "light");
            }}
            size="l"
            content="Тема"
        />
    );
}
