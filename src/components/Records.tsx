import React from 'react';
import { defaultCharSets } from '../lib/charSets';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

interface Record {
    timestamp: number;
    time: number;
    mistakes: number;
    charSetId: string;
}

interface RecordsProps {
    records: Record[];
    onClearRecords: () => void;
}

export const Records: React.FC<RecordsProps> = ({ records, onClearRecords }) => {
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
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold dark:text-white">
                    記録一覧（保存件数: {records.length}件）
                </h3>
                {records.length > 0 && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                aria-label="履歴をクリア"
                            >
                                <Trash2 className="w-5 h-5" />
                                <span>履歴をクリア</span>
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>履歴のクリア確認</AlertDialogTitle>
                                <AlertDialogDescription>
                                    すべての記録が削除されます。この操作は取り消せません。
                                    実行してもよろしいですか？
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={onClearRecords}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    削除する
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
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