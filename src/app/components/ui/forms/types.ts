/**
 * Selectbox
 */
export type RendererType = {
    customLiRenderer?: (item: any) => JSX.Element
}

export type SelectBoxItem = {
    label?: string
    value: string
    data?: string
} & RendererType

export type SelectboxProp = {
    keyName?: string
    defaultLabel?: string
    defaultItem?: SelectBoxItem
    items: Array<SelectBoxItem>
    onChange?: (item: SelectBoxItem) => void
    classList?: Array<string> | string
    isTableIn?: boolean
    isBoxIn?: boolean
    isTop?: boolean
    hasAll?: boolean //전체 체크박스 추가 여부
    isEdit?: boolean
    disabled?: boolean
    multiSelect?: boolean // 멀티 셀렉박스 여부
    children?: React.ReactNode
} & RendererType

export interface OptionStyleProp {
    top: string
    left?: string
}

export interface sizeCheckProp {
    width: number
    height: number
    scrollX: number
    scrollY: number
}

/**
 * FormItem
 */
export type FormGroupProp = {
    title: string
    children: React.ReactNode
    customClassName?: Array<string>
    required?: boolean
    refreshBtn?: boolean
    refreshEvent?: () => void
}

export interface FormItemProp {
    title?: string
    isDivide?: boolean
    children?: React.ReactNode
    isSplit?: boolean
    customClassName?: Array<string>
    required?: boolean
    tooltip?: string
    refreshBtn?: boolean
    refreshEvent?: () => void
}
