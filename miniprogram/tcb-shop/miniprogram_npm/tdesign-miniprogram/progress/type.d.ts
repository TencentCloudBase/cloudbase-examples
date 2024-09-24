export interface TdProgressProps {
    color?: {
        type: null;
        value?: string | Array<string> | Record<string, string>;
    };
    label?: {
        type: null;
        value?: string | boolean;
    };
    percentage?: {
        type: NumberConstructor;
        value?: number;
    };
    status?: {
        type: StringConstructor;
        value?: StatusEnum;
    };
    strokeWidth?: {
        type: null;
        value?: string | number;
    };
    style?: {
        type: StringConstructor;
        value?: string;
    };
    theme?: {
        type: StringConstructor;
        value?: ThemeEnum;
    };
    trackColor?: {
        type: StringConstructor;
        value?: string;
    };
}
export declare type StatusEnum = 'success' | 'error' | 'warning' | 'active';
export declare type ThemeEnum = 'line' | 'plump' | 'circle';
