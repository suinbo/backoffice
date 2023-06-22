/** Checkbox */
export type CheckItemProp = {
    label?: string
    value: string
}

/** Checkbod List */
export type CheckItems = Array<CheckItemProp>
export interface CheckListProp {
    checkBoxItems: CheckItems
    onChange?: (items: Array<string>, value?: string) => void
    allChecked?: boolean
    checkedItems?: Array<string> | []
    dimList?: Array<string>
    blockEventList?: Array<string>
}

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
 * Selectbox List
 */
export type SelectBoxListItem = {
    inputValue: string
    selectBoxItem: SelectBoxItem
    origin: boolean
}

export interface SelectBoxListProp {
    selectList: SelectBoxItem[]
    listItems: SelectBoxListItem[]
    emptyLabel?: string
    inputLabel?: string
    setlistItems?: (itemList: SelectBoxListItem[]) => void
    onInputChange?: (item: SelectBoxListItem) => void
    onSelectBoxChange?: (item: SelectBoxListItem) => void
    onDeleteBoxClick?: (item: SelectBoxListItem) => void
    readonly?: boolean
}

/** Multi Selectbox */
export type MultiSelectBoxItem = SelectBoxItem & { isChecked: boolean }
export type CheckItemBySelectBox = CheckItemProp & { isChecked: boolean }

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

/** Search Form */
export interface SearchFormProp {
    title: string
    children: React.ReactNode
    onSearch: (e: React.KeyboardEvent<HTMLInputElement>) => void
    onClear?: () => void
    downloadEvent?: () => void
    download?: boolean
}
