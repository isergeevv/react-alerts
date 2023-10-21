interface AlertMessage {
    id: number;
    title: string;
    text: string;
    type: string;
    remove: number;
}
interface AlertType {
    bg: string;
    text: string;
}
type AlertTypes = Record<string, AlertType>;
interface AlertOptions {
    time: number;
    fadeTime: number;
    alertTypes: AlertTypes;
}
declare const _default: (props?: Partial<AlertOptions>) => {
    push: (title: string, text: string, type?: string) => void;
    remove: (id: number) => void;
    types: AlertTypes;
    duration: number;
    fadeTime: number;
    messages: AlertMessage[];
};

export { AlertMessage, AlertOptions, AlertType, AlertTypes, _default as default };
