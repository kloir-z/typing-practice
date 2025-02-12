import { useState, useEffect } from 'react';

const THEME_KEY = 'typing-theme';

export const useTheme = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        } else {
            setIsDarkMode(true);
            localStorage.setItem(THEME_KEY, 'dark');
        }
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
        localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    return [isDarkMode, setIsDarkMode] as const;
};
