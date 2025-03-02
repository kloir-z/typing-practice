import { useState, useEffect, useCallback, useMemo } from 'react';
import { CharacterSet } from '../lib/charSets';

interface Record {
    timestamp: number;
    time: number;
    mistakes: number;
    charSetId: string;
}

const STORAGE_KEY = 'typing-records';
const INPUT_BUFFER = 5;
const MAX_RECORDS = 1000;

export const useTypingGame = (text: string, currentCharSet: CharacterSet) => {
    const [input, setInput] = useState<string>('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [mistakes, setMistakes] = useState<number>(0);
    const [records, setRecords] = useState<Record[]>([]);

    const displayText = text;

    const charMap = useMemo(() => {
        const map: { char: string, index: number }[] = [];
        const processedText = displayText.replace(/\n/g, ' ');
        const textChars = processedText.split('');

        textChars.forEach((char, index) => {
            map.push({ char, index });
        });

        return map;
    }, [displayText]);

    useEffect(() => {
        const savedRecords = localStorage.getItem(STORAGE_KEY);
        if (savedRecords) {
            setRecords(JSON.parse(savedRecords));
        }
    }, []);

    useEffect(() => {
        let intervalId: number;
        if (isRunning) {
            intervalId = window.setInterval(() => {
                setElapsedTime(prevTime => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [isRunning]);

    const clearRecords = useCallback(() => {
        setRecords([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const saveRecord = useCallback((time: number, mistakes: number) => {
        const newRecord: Record = {
            timestamp: Date.now(),
            time,
            mistakes,
            charSetId: currentCharSet.id
        };
        const updatedRecords = [...records, newRecord]
            .sort((a, b) => {
                if (a.time === b.time) {
                    return a.mistakes - b.mistakes;
                }
                return a.time - b.time;
            })
            .slice(0, MAX_RECORDS);

        setRecords(updatedRecords);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
    }, [records, currentCharSet]);

    const reset = useCallback(() => {
        setInput('');
        setStartTime(null);
        setElapsedTime(0);
        setIsRunning(false);
        setIsComplete(false);
        setMistakes(0);
    }, []);

    const isInputCorrect = useCallback(() => {
        for (let i = 0; i < input.length; i++) {
            if (i >= charMap.length || input[i] !== charMap[i].char) {
                return false;
            }
        }
        return true;
    }, [input, charMap]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (isComplete) {
            return;
        }

        if (!isRunning && !startTime && e.key.length === 1) {
            setStartTime(Date.now());
            setIsRunning(true);
        }

        if (e.key === 'Backspace') {
            setInput(prev => prev.slice(0, -1));
            return;
        }

        if (e.key.length === 1) {
            if (input.length >= charMap.length + INPUT_BUFFER) {
                return;
            }

            const newInput = input + e.key;
            setInput(newInput);

            if (input.length < charMap.length) {
                const expectedChar = charMap[input.length].char;
                if (e.key !== expectedChar) {
                    setMistakes(prev => prev + 1);
                }
            }

            if (newInput.length === charMap.length && isInputCorrect()) {
                setIsRunning(false);
                setIsComplete(true);
                saveRecord(elapsedTime, mistakes);
            }
        }
    }, [
        charMap,
        elapsedTime,
        input,
        isComplete,
        isInputCorrect,
        isRunning,
        mistakes,
        saveRecord,
        startTime
    ]);

    return {
        input,
        elapsedTime,
        mistakes,
        isRunning,
        isComplete,
        records,
        reset,
        handleKeyDown,
        isInputCorrect,
        clearRecords
    };
};