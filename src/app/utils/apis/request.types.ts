import { SelectBoxItem } from "@/components/ui/forms/types"

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
    systemId: string
    depth?: number
    codeValue?: string
    name: string
}

export type PageCodeList = {
    depth: number
    id: string
    leafs: Array<{
        depth: number
        id: string
        leafs?: Array<PageCodeListProps>
        name: string
        systemId: string
    }>
    name: string
    systemId: string
}

export type PageCodeDetailProps<T = SelectBoxItem> = {
    id: string
    items: Array<T>
}
