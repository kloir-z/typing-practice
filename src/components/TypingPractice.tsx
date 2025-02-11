import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { RefreshCcw, Trophy, Moon, Sun, Settings } from 'lucide-react';
import { CharacterSet, defaultCharSets } from '../lib/charSets';

interface Record {
  timestamp: number;
  time: number;
  mistakes: number;
  charSetId: string;
}

const STORAGE_KEY = 'typing-records';
const THEME_KEY = 'typing-theme';
const CHAR_SET_KEY = 'typing-char-set';

const generatePracticeText = (charSet: CharacterSet) => {
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

  return result.join('');
};

const TypingPractice: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<number>(0);
  const [showRecords, setShowRecords] = useState<boolean>(false);
  const [records, setRecords] = useState<Record[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [currentCharSet, setCurrentCharSet] = useState<CharacterSet>(defaultCharSets[0]);
  const [showSettings, setShowSettings] = useState(false);
  const typingAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedRecords = localStorage.getItem(STORAGE_KEY);
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }

    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(true);
      localStorage.setItem(THEME_KEY, 'dark');
    }

    const savedCharSetId = localStorage.getItem(CHAR_SET_KEY);
    if (savedCharSetId) {
      const savedCharSet = defaultCharSets.find(cs => cs.id === savedCharSetId);
      if (savedCharSet) {
        setCurrentCharSet(savedCharSet);
      }
    }
  }, []);

  useEffect(() => {
    setText(generatePracticeText(currentCharSet));
  }, [currentCharSet]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

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
    setText(generatePracticeText(currentCharSet));
    setInput('');
    setStartTime(null);
    setElapsedTime(0);
    setIsRunning(false);
    setMistakes(0);
    if (typingAreaRef.current) {
      typingAreaRef.current.focus();
    }
  }, [currentCharSet]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
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

      let newMistakes = mistakes;
      if (e.key !== text[input.length]) {
        newMistakes++;
      }
      setMistakes(newMistakes);

      if (newInput.length === text.length) {
        setIsRunning(false);
        saveRecord(elapsedTime, newMistakes);
      }
    }
  }, [text, input, startTime, isRunning, elapsedTime, mistakes, saveRecord]);

  const handleChangeCharSet = (charSetId: string) => {
    const newCharSet = defaultCharSets.find(cs => cs.id === charSetId);
    if (newCharSet) {
      setCurrentCharSet(newCharSet);
      localStorage.setItem(CHAR_SET_KEY, charSetId);
      reset();
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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`min-h-screen w-full ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-3xl dark:text-white">
              <span>全文字タイピング練習</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full dark:text-gray-300"
                  aria-label="設定"
                  title="設定"
                >
                  <Settings className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full dark:text-gray-300"
                  aria-label={isDarkMode ? "ライトモードに切り替え" : "ダークモードに切り替え"}
                  title={isDarkMode ? "ライトモードに切り替え" : "ダークモードに切り替え"}
                >
                  {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </button>
                <button
                  onClick={() => setShowRecords(!showRecords)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full dark:text-gray-300"
                  aria-label="記録を見る"
                  title="記録を見る"
                >
                  <Trophy className="w-6 h-6" />
                </button>
                <button
                  onClick={reset}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full dark:text-gray-300"
                  aria-label="タイピング練習をリセット"
                  title="タイピング練習をリセット"
                >
                  <RefreshCcw className="w-6 h-6" />
                </button>
              </div>
            </CardTitle>
            {showSettings && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="text-lg font-semibold mb-2 dark:text-white">練習する文字セット</h4>
                <div className="space-y-2">
                  {defaultCharSets.map(charSet => (
                    <div
                      key={charSet.id}
                      className={`p-3 rounded cursor-pointer ${currentCharSet.id === charSet.id
                          ? 'bg-blue-100 dark:bg-blue-900'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      onClick={() => handleChangeCharSet(charSet.id)}
                    >
                      <div className="font-medium dark:text-white">{charSet.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {charSet.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!showRecords ? (
              <>
                <div
                  ref={typingAreaRef}
                  tabIndex={0}
                  className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-2xl font-mono outline-none relative whitespace-pre-wrap"
                >
                  <div className="break-all leading-relaxed tracking-wider">
                    {text.split('').map((char, index) => {
                      const isCurrentPosition = index === input.length;
                      const isTyped = index < input.length;
                      const isCorrect = isTyped && input[index] === char;
                      const isWrong = isTyped && input[index] !== char;

                      return (
                        <span key={index} className="relative">
                          {isWrong && (
                            <span className="absolute -top-6 left-0 text-red-600 dark:text-red-400">
                              {input[index]}
                            </span>
                          )}
                          <span
                            className={
                              isCurrentPosition
                                ? 'text-gray-800 dark:text-gray-200 bg-blue-200 dark:bg-blue-800'
                                : isCorrect
                                  ? 'text-gray-800 dark:text-gray-200'
                                  : isWrong
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-gray-400 dark:text-gray-600'
                            }
                          >
                            {char}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-lg text-gray-500 dark:text-gray-400">経過時間</div>
                    <div className="text-3xl font-bold dark:text-white">{elapsedTime}秒</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg text-gray-500 dark:text-gray-400">ミス</div>
                    <div className="text-3xl font-bold dark:text-white">{mistakes}</div>
                  </div>
                </div>

                {input.length === text.length && (
                  <div className="mt-6 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg text-center text-xl">
                    完了！リセットボタンで新しい練習を開始できます
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">記録一覧（上位10件）</h3>
                <div className="space-y-2">
                  {records.slice(0, 10).map((record, index) => (
                    <div key={record.timestamp} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="text-lg dark:text-white">
                        {index + 1}. {record.time}秒 （ミス: {record.mistakes}回）
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                          {defaultCharSets.find(cs => cs.id === record.charSetId)?.name || '全文字'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(record.timestamp)}
                      </div>
                    </div>
                  ))}
                  {records.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      記録はまだありません
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TypingPractice;