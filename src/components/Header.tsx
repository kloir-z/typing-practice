import React from 'react';
import { Settings, Sun, Moon, Trophy, RefreshCcw } from 'lucide-react';
import { CardTitle } from './ui/card';

interface HeaderProps {
    isDarkMode: boolean;
    onToggleSettings: () => void;
    onToggleDarkMode: () => void;
    onToggleRecords: () => void;
    onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    isDarkMode,
    onToggleSettings,
    onToggleDarkMode,
    onToggleRecords,
    onReset
}) => (
    <CardTitle className="flex justify-between items-center text-3xl dark:text-white">
        <span>全文字タイピング練習</span>
        <div className="flex gap-2">
            <button
                onClick={onToggleSettings}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full dark:text-gray-300"
                aria-label="設定"
                title="設定"
            >
                <Settings className="w-6 h-6" />
            </button>
            <button
                onClick={onToggleDarkMode}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full dark:text-gray-300"
                aria-label={isDarkMode ? "ライトモードに切り替え" : "ダークモードに切り替え"}
                title={isDarkMode ? "ライトモードに切り替え" : "ダークモードに切り替え"}
            >
                {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
            <button
                onClick={onToggleRecords}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full dark:text-gray-300"
                aria-label="記録を見る"
                title="記録を見る"
            >
                <Trophy className="w-6 h-6" />
            </button>
            <button
                onClick={onReset}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full dark:text-gray-300"
                aria-label="タイピング練習をリセット"
                title="タイピング練習をリセット"
            >
                <RefreshCcw className="w-6 h-6" />
            </button>
        </div>
    </CardTitle>
);
