export const LabelStyleType = {
    success: 'exposure',
    danger: 'unexposed',
    reservation: 'reservation',
} as const

export interface LabelsProps {
    children: string
    styleType: string
}

export interface LabelComponentProps {
    message: string
    styleType: typeof LabelStyleType[keyof typeof LabelStyleType]
}
