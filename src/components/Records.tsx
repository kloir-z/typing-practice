import React from 'react';
import { defaultCharSets } from '../lib/charSets';

interface RecordsProps {
    records: Array<{
        timestamp: number;
        time: number;
        mistakes: number;
        charSetId: string;
    }>;
}

export const Records: React.FC<RecordsProps> = ({ records }) => {
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
        <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4 dark:text-white">記録一覧（保存件数: {records.length}件）</h3>
            <div className="space-y-2">
                {records.map((record, index) => (
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
    );
};