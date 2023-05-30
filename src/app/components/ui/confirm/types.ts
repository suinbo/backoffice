export const ConfirmType = {
    success: "success",
    warning: "warning",
    danger: "danger",
    info: "info",
    alert: "alert",
    reject: "reject",
    approve: "approve",
} as const
export type ConfirmTypeKey = (typeof ConfirmType)[keyof typeof ConfirmType]

export interface ConfirmProp {
    type?: ConfirmTypeKey
    visible: boolean
    setVisible: (value: React.SetStateAction<boolean>) => void
    title?: string
    message: string
    buttonStyle: string
    applyButtonMessage: string
    onApply?: () => void
    onClose?: () => void
}
