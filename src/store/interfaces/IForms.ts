export interface IInputsForm {
    name: string;
    label: string;
    alertText?: string;
    keyfilter: string | RegExp;
    placeholder?: string;
    onChange?: (e: any) => void;
    disabled?: boolean;
    value?: string;
    type?: string;
    options?: any[];
    maxLength?: number;
}