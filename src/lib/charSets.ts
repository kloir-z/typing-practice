export interface CharacterSet {
    id: string;
    name: string;
    chars: string;
    description: string;
}

export const defaultCharSets: CharacterSet[] = [
    {
        id: 'all',
        name: '全文字',
        chars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}\\|;:\'",.<>?/~`',
        description: 'アルファベット、数字、記号を含むすべての文字'
    },
    {
        id: 'alphanumeric',
        name: '英数字のみ',
        chars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        description: 'アルファベットと数字のみ'
    },
    {
        id: 'symbols',
        name: '記号のみ',
        chars: '!@#$%^&*()_+-=[]{}\\|;:\'",.<>?/~`',
        description: '記号のみ'
    },
];