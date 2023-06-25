export type MenuStateType = {
    menuId?: string
    depth?: number
    hasLeafs?: boolean
    nodeId?: string | null
    viewYn?: boolean
}

export type MenuDetailProp = {
    id: string
    orderNo: number
    desc: string
    viewYn: boolean
    menuNm: string
    langList: Array<Menulanguage>
}

export type Menulanguage = { rdx: number, regionCd: string; regionNm: string, languageNm: string }
