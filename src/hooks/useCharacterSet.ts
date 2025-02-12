import { useState, useEffect } from 'react';
import { CharacterSet, defaultCharSets } from '../lib/charSets';

const CHAR_SET_KEY = 'typing-char-set';

export const useCharacterSet = (onChangeCallback?: () => void) => {
    const [currentCharSet, setCurrentCharSet] = useState<CharacterSet>(defaultCharSets[0]);

    useEffect(() => {
        const savedCharSetId = localStorage.getItem(CHAR_SET_KEY);
        if (savedCharSetId) {
            const savedCharSet = defaultCharSets.find(cs => cs.id === savedCharSetId);
            if (savedCharSet) {
                setCurrentCharSet(savedCharSet);
            }
        }
    }, []);

    const handleChangeCharSet = (charSetId: string) => {
        const newCharSet = defaultCharSets.find(cs => cs.id === charSetId);
        if (newCharSet) {
            setCurrentCharSet(newCharSet);
            localStorage.setItem(CHAR_SET_KEY, charSetId);
            if (onChangeCallback) {
                onChangeCallback();
            }
        }
    };

    return {
        currentCharSet,
        handleChangeCharSet,
    };
};