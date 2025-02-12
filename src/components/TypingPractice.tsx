import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Header } from './header';
import { Settings } from './Settings';
import { TypingArea } from './TypingArea';
import { Stats } from './Stats';
import { Records } from './Records';
import { CompletionMessage } from './CompletionMessage';
import { useTheme } from '../hooks/useTheme';
import { useCharacterSet } from '../hooks/useCharacterSet';
import { useTypingGame } from '../hooks/useTypingGame';
import { usePracticeText } from '../hooks/usePracticeText';
import { defaultCharSets } from '../lib/charSets';

const TypingPractice: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useTheme();
  const { currentCharSet, handleChangeCharSet } = useCharacterSet();
  const [text, generatePracticeText] = usePracticeText(currentCharSet);
  const { input, elapsedTime, mistakes, records, reset, handleKeyDown } = useTypingGame(text, currentCharSet);
  
  const [showRecords, setShowRecords] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const typingAreaRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    reset();
    generatePracticeText();
    if (typingAreaRef.current) {
      typingAreaRef.current.focus();
    }
  };

  useEffect(() => {
    if (typingAreaRef.current) {
      typingAreaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className={`min-h-screen w-full ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <Header
              isDarkMode={isDarkMode}
              onToggleSettings={() => setShowSettings(!showSettings)}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              onToggleRecords={() => setShowRecords(!showRecords)}
              onReset={handleReset}
            />
            {showSettings && (
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
                  isComplete={input.length === text.length}
                />
              </>
            ) : (
              <Records records={records} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TypingPractice;