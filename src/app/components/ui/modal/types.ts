import { ReactNode } from 'react'

/** Common modal */
export interface ModalProp {
    onClose?: () => void
    headerRenderer?: () => ReactNode | null
    footerRenderer?: () => ReactNode | null
    children: string | ReactNode
    classList: Array<string>
    maintain?: boolean
}
