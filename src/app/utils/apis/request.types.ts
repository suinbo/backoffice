import { SelectBoxItem } from "@/components/ui/forms/types"

export type FlagYN = "Y" | "N" | ""

export type RequestPage = {
    page: number
    size: number
    search?: string
    sType?: string
    codeId?: string
}

export type TableList<L, T = number> = {
    list: L
    totalCount: T
    maxOrderNo?: T
}

/** TYPE OF SYSTEM CODE */
export type PageCodeListProps = {
    id: string
    name: string
    value: string
    depth?: number
}

export type PageCodeList = {
    depth: number
    id: string
    leafs: Array<{
        depth: number
        id: string
        leafs?: Array<PageCodeListProps>
        name: string
        value: string
    }>
    name: string
    value: string
}

export type PageCodeDetailProps<T = SelectBoxItem> = {
    id: string
    items: Array<T>
    name?: string
}

export type POCListProp<T = string> = {
    code: T
}

export type TimeType = {
    date: Date
    time: string
}
