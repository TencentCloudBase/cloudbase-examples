import { ButtonProps } from '../button/index';
export interface TdFabProps {
    buttonProps?: {
        type: ObjectConstructor;
        value?: ButtonProps;
    };
    draggable?: {
        type: BooleanConstructor;
        optionalTypes: Array<StringConstructor>;
        value?: boolean | 'all' | 'vertical' | 'horizontal';
    };
    icon?: {
        type: StringConstructor;
        value?: string;
    };
    style?: {
        type: StringConstructor;
        value?: string;
    };
    text?: {
        type: StringConstructor;
        value?: string;
    };
    usingCustomNavbar?: {
        type: BooleanConstructor;
        value?: boolean;
    };
}
