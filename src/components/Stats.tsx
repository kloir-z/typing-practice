interface StatsProps {
    elapsedTime: number;
    mistakes: number;
}

export const Stats: React.FC<StatsProps> = ({ elapsedTime, mistakes }) => (
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
);
