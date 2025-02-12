import { useState } from 'react';

const THEME_KEY = 'typing-theme';

export const useTheme = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem(THEME_KEY);
        return savedTheme ? savedTheme === 'dark' : true;
    });

    const updateTheme = (dark: boolean) => {
        setIsDarkMode(dark);
        localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', dark);
    };

    return [isDarkMode, updateTheme] as const;
};