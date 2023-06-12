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
