export type ValidDateProp = {
    startDateTime?: number
    endDateTime?: number
    maxDateTime?: number
    minDateTime?: number
}

export interface DatePickerProp {
    date: Date
    onChange: (date: Date) => void
    readOnly?: boolean
    disabled?: boolean
    isOnlyDate?: boolean
    validItem?: ValidDateProp
}
