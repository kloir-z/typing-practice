import { useState, useCallback, useEffect } from 'react';
import { CharacterSet } from '../lib/charSets';

export const usePracticeText = (charSet: CharacterSet) => {
    const [text, setText] = useState<string>('');

    const generatePracticeText = useCallback(() => {
        // 数字群モードの場合
        if (charSet.displayMode === 'numberGroups' && charSet.numberGroupsConfig) {
            const { groupCount, minDigits, maxDigits } = charSet.numberGroupsConfig;
            const numberGroups: string[] = [];

            // 記号と数字を分離
            const digits = charSet.chars.match(/[0-9]/g) || [];
            const symbols = charSet.chars.match(/[^0-9]/g) || [];

            // 記号が含まれている場合の特別処理
            const hasSymbols = symbols.length > 0;

            // 指定された数のグループを生成
            for (let i = 0; i < groupCount; i++) {
                // 各グループの桁数をランダムに決定
                const digitCount = Math.floor(Math.random() * (maxDigits - minDigits + 1)) + minDigits;
                let numberGroup = '';

                // 各桁の文字を生成
                for (let j = 0; j < digitCount; j++) {
                    // 記号が含まれている場合
                    if (hasSymbols) {
                        // 記号の出現確率
                        const useSymbol = Math.random() < 0.65;

                        // 前の文字が記号なら数字を使用（記号の連続を防ぐ）
                        const prevIsSymbol = j > 0 && !(/[0-9]/.test(numberGroup[j - 1]));

                        if (useSymbol && !prevIsSymbol) {
                            // 記号をランダムに選択
                            numberGroup += symbols[Math.floor(Math.random() * symbols.length)];
                        } else {
                            // 数字をランダムに選択
                            numberGroup += digits[Math.floor(Math.random() * digits.length)];
                        }

                        // 最初の文字は必ず数字にする（より読みやすく）
                        if (j === 0) {
                            numberGroup = digits[Math.floor(Math.random() * digits.length)];
                        }

                        // 各グループに少なくとも1つの記号を含めるための処理
                        if (j === digitCount - 2 && !numberGroup.match(/[^0-9]/)) {
                            numberGroup += symbols[Math.floor(Math.random() * symbols.length)];
                            j++;
                        }
                    } else {
                        // 数字のみの場合
                        numberGroup += charSet.chars[Math.floor(Math.random() * charSet.chars.length)];
                    }
                }

                numberGroups.push(numberGroup);
            }

            // 1行につき確実に収まるグループ数
            const groupsPerLine = 4;

            // 行ごとにグループを結合
            const lines: string[] = [];
            for (let i = 0; i < numberGroups.length; i += groupsPerLine) {
                // 現在の行に含めるグループを取得
                const lineGroups = numberGroups.slice(i, Math.min(i + groupsPerLine, numberGroups.length));
                // グループをスペースで結合して1行のテキストを作成
                lines.push(lineGroups.join(' '));
            }

            // 全ての行を改行文字で結合
            setText(lines.join('\n'));

            return;
        }

        // 通常モードの場合（既存のロジック）
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