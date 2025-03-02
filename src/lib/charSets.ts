export interface CharacterSet {
    id: string;
    name: string;
    chars: string;
    description: string;
    displayMode?: 'normal' | 'numberGroups';
    numberGroupsConfig?: {
        groupCount: number;
        minDigits: number;
        maxDigits: number;
    };
}

export const defaultCharSets: CharacterSet[] = [
    {
        id: 'all',
        name: '全文字',
        chars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}\\|;:\'",.<>?/~`',
        description: 'アルファベット、数字、記号を含むすべての文字'
    },
    {
        id: 'symbols',
        name: '記号のみ',
        chars: '!@#$%^&*()_+-=[]{}\\|;:\'",.<>?/~`',
        description: '記号のみ'
    },
    {
        id: 'numberGroups',
        name: '数字のみ',
        chars: '0123456789',
        description: '数字のみ',
        displayMode: 'numberGroups',
        numberGroupsConfig: {
            groupCount: 20,
            minDigits: 3,
            maxDigits: 10
        }
    },
    {
        id: 'numberSymbolGroups',
        name: '数字と記号モード',
        chars: '0123456789:,.=-+*/%#_()$',
        description: '数字と一緒によく使われる記号を含むモード',
        displayMode: 'numberGroups',
        numberGroupsConfig: {
            groupCount: 17,    // 行あたり4グループ×5行
            minDigits: 5,      // 最小5桁
            maxDigits: 9       // 最大9桁
        }
    }
];