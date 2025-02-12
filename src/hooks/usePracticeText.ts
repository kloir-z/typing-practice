import { useState, useCallback, useEffect } from 'react';
import { CharacterSet } from '../lib/charSets';

export const usePracticeText = (charSet: CharacterSet) => {
    const [text, setText] = useState<string>('');

    const generatePracticeText = useCallback(() => {
        const charArray = charSet.chars.split('');

        for (let i = charArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [charArray[i], charArray[j]] = [charArray[j], charArray[i]];
        }

        const result: string[] = [];
        for (let i = 0; i < charArray.length; i++) {
            result.push(charArray[i]);
            if ((i + 1) % 10 === 0 && i < charArray.length - 1) {
                result.push(' ');
            }
        }

        setText(result.join(''));
    }, [charSet]);

    useEffect(() => {
        generatePracticeText();
    }, [charSet, generatePracticeText]);

    return [text, generatePracticeText] as const;
};
