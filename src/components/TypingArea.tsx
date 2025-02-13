import React from 'react';

interface TypingAreaProps {
    text: string;
    input: string;
    inputRef: React.RefObject<HTMLDivElement | null>;
}

export const TypingArea: React.FC<TypingAreaProps> = ({ text, input, inputRef }) => {
    return (
        <div
            ref={inputRef}
            tabIndex={0}
            className="mb-6 p-8 bg-gray-50 dark:bg-gray-900 rounded-lg text-2xl font-mono outline-none relative whitespace-pre-wrap"
        >
            <div className="break-all leading-loose tracking-wider">
                {text.split('').map((char, index) => {
                    const isCurrentPosition = index === input.length;
                    const isTyped = index < input.length;
                    const isCorrect = isTyped && input[index] === char;
                    const isWrong = isTyped && input[index] !== char;

                    return (
                        <span key={index} className="relative">
                            {isWrong && (
                                <span className="absolute -top-8 left-0 text-red-600 dark:text-red-400">
                                    {input[index]}
                                </span>
                            )}
                            <span
                                className={`${isCurrentPosition
                                    ? 'text-gray-800 dark:text-gray-200 bg-blue-200 dark:bg-blue-800'
                                    : isCorrect
                                        ? 'text-gray-800 dark:text-gray-200'
                                        : isWrong
                                            ? 'text-red-600 dark:text-red-400'
                                            : 'text-gray-400 dark:text-gray-600'
                                    } transition-all duration-200 ease-out`}
                            >
                                {char}
                            </span>
                        </span>
                    );
                })}

                {/* バッファー部分の表示 */}
                {input.length > text.length && (
                    <span className="relative">
                        <span className="absolute -top-8 left-0 text-red-600 dark:text-red-400">
                            {input.slice(text.length)}
                        </span>
                        <span className="text-red-600 dark:text-red-400">
                            {' '.repeat(input.length - text.length)}
                        </span>
                    </span>
                )}

                {/* バッファー部分のカーソルのみ表示 */}
                {input.length >= text.length && (
                    <span className="bg-blue-200 dark:bg-blue-800">&nbsp;</span>
                )}
            </div>
        </div>
    );
};