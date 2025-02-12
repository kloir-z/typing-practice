import { useState, useEffect, useCallback } from 'react';
import { CharacterSet } from '../lib/charSets';

interface Record {
    timestamp: number;
    time: number;
    mistakes: number;
    charSetId: string;
}

const STORAGE_KEY = 'typing-records';

export const useTypingGame = (text: string, currentCharSet: CharacterSet) => {
    const [input, setInput] = useState<string>('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [mistakes, setMistakes] = useState<number>(0);
    const [records, setRecords] = useState<Record[]>([]);

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

    const saveRecord = useCallback((time: number, mistakes: number) => {
        const newRecord: Record = {
            timestamp: Date.now(),
            time,
            mistakes,
            charSetId: currentCharSet.id
        };
        const updatedRecords = [...records, newRecord].sort((a, b) => a.time - b.time);
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
            const newInput = input + e.key;
            setInput(newInput);

            if (e.key !== text[input.length]) {
                setMistakes(prev => prev + 1);
            }

            if (newInput.length === text.length) {
                setIsRunning(false);
                setIsComplete(true);
                saveRecord(elapsedTime, mistakes);
            }
        }
    }, [text, input, startTime, isRunning, isComplete, elapsedTime, mistakes, saveRecord]);

    return {
        input,
        elapsedTime,
        mistakes,
        isRunning,
        isComplete,
        records,
        reset,
        handleKeyDown
    };
};