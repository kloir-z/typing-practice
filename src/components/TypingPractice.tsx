import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Header } from './Header';
import { Settings } from './Settings';
import { TypingArea } from './TypingArea';
import { Stats } from './Stats';
import { Records } from './Records';
import { CompletionMessage } from './CompletionMessage';
import { useTheme } from '../hooks/useTheme';
import { useCharacterSet } from '../hooks/useCharacterSet';
import { useTypingGame } from '../hooks/useTypingGame';
import { usePracticeText } from '../hooks/usePracticeText';
import { useCursorIdle } from '../hooks/useCursorIdle';
import { defaultCharSets } from '../lib/charSets';

const TypingPractice: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useTheme();
  const [showRecords, setShowRecords] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const typingAreaRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    if (reset && generatePracticeText && typingAreaRef.current) {
      reset();
      generatePracticeText();
      setShowRecords(false);
      typingAreaRef.current.focus();
    }
  };

  const { currentCharSet, handleChangeCharSet } = useCharacterSet(handleReset);

  const [text, generatePracticeText] = usePracticeText(currentCharSet);

  const {
    input,
    elapsedTime,
    mistakes,
    records,
    isRunning,
    isComplete,
    reset,
    handleKeyDown,
    clearRecords
  } = useTypingGame(text, currentCharSet);

  const isCursorIdle = useCursorIdle(isRunning);

  const handleToggleSettings = () => {
    if (!isRunning) {
      setShowSettings(!showSettings);
      setShowRecords(false);
    }
  };

  const handleToggleRecords = () => {
    if (!isRunning) {
      setShowRecords(!showRecords);
      setShowSettings(false);
    }
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (typingAreaRef.current && !showRecords) {
      setTimeout(() => {
        typingAreaRef.current?.focus();
      }, 0);
    }
  };

  useEffect(() => {
    if (typingAreaRef.current && !showRecords) {
      typingAreaRef.current.focus();
    }
  }, [showRecords]);

  useEffect(() => {
    if (!showRecords) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown, showRecords]);

  useEffect(() => {
    const handleFocus = () => {
      if (isRunning && typingAreaRef.current && !showRecords) {
        typingAreaRef.current.focus();
      }
    };

    window.addEventListener('click', handleFocus);
    return () => window.removeEventListener('click', handleFocus);
  }, [isRunning, showRecords]);

  return (
    <div
      className={`min-h-screen w-full ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'} ${isCursorIdle ? 'cursor-none' : ''
        }`}
    >
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <Header
              isDarkMode={isDarkMode}
              onToggleSettings={handleToggleSettings}
              onToggleDarkMode={handleToggleDarkMode}
              onToggleRecords={handleToggleRecords}
              onReset={handleReset}
              isRunning={isRunning}
            />
            {showSettings && !isRunning && (
              <Settings
                charSets={defaultCharSets}
                currentCharSet={currentCharSet}
                onChangeCharSet={handleChangeCharSet}
              />
            )}
          </CardHeader>
          <CardContent>
            {!showRecords ? (
              <>
                <TypingArea
                  text={text}
                  input={input}
                  inputRef={typingAreaRef}
                />
                <Stats
                  elapsedTime={elapsedTime}
                  mistakes={mistakes}
                />
                <CompletionMessage
                  isComplete={isComplete}
                />
              </>
            ) : (
              <Records
                records={records}
                onClearRecords={clearRecords}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TypingPractice;