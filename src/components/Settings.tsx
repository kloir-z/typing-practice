import React from 'react';
import { CharacterSet } from '../lib/charSets';

interface SettingsProps {
    charSets: CharacterSet[];
    currentCharSet: CharacterSet;
    onChangeCharSet: (id: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({
    charSets,
    currentCharSet,
    onChangeCharSet
}) => (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="text-lg font-semibold mb-2 dark:text-white">練習する文字セット</h4>
        <div className="space-y-2">
            {charSets.map(charSet => (
                <div
                    key={charSet.id}
                    className={`p-3 rounded cursor-pointer ${currentCharSet.id === charSet.id
                            ? 'bg-blue-100 dark:bg-blue-900'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                    onClick={() => onChangeCharSet(charSet.id)}
                >
                    <div className="font-medium dark:text-white">{charSet.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        {charSet.description}
                    </div>
                </div>
            ))}
        </div>
    </div>
);
