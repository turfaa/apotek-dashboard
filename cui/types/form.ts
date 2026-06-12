export type FormFieldType = "TEXT" | "TEXTAREA" | "SELECT"

export interface Form {
    title?: string
    fields: FormField[]
}

export interface FormField {
    id: string
    label: string
    type: FormFieldType
    value?: string
    options?: Option[]
    required?: boolean
}

export interface Options {
    options: Option[]
}

export interface Option {
    value: string
    label: string
}
