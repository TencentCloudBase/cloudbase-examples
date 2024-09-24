export interface TdOverlayProps {
    backgroundColor?: {
        type: StringConstructor;
        value?: string;
    };
    customStyle?: {
        type: StringConstructor;
        value?: string;
    };
    duration?: {
        type: NumberConstructor;
        value?: number;
    };
    preventScrollThrough?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    style?: {
        type: StringConstructor;
        value?: string;
    };
    usingCustomNavbar?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    visible?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    zIndex?: {
        type: NumberConstructor;
        value?: number;
    };
}
