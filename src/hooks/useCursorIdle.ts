import { useState, useEffect } from 'react';

export const useCursorIdle = (isRunning: boolean, idleTime: number = 2000) => {
    const [isIdle, setIsIdle] = useState(false);
    const [lastMoved, setLastMoved] = useState(Date.now());

    useEffect(() => {
        if (!isRunning) {
            setIsIdle(false);
            return;
        }

        const handleMouseMove = () => {
            setLastMoved(Date.now());
            setIsIdle(false);
        };

        const checkIdle = () => {
            if (Date.now() - lastMoved > idleTime) {
                setIsIdle(true);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        const intervalId = setInterval(checkIdle, 100);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearInterval(intervalId);
        };
    }, [isRunning, idleTime, lastMoved]);

    return isIdle;
};