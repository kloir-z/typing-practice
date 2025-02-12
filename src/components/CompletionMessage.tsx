interface CompletionMessageProps {
    isComplete: boolean;
}

export const CompletionMessage: React.FC<CompletionMessageProps> = ({ isComplete }) => {
    if (!isComplete) return null;

    return (
        <div className="mt-6 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg text-center text-xl">
            完了！リセットボタンで新しい練習を開始できます
        </div>
    );
};
