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
    dUxId: string
    uxList: Array<MenuUxProps>
    defaultName: string
    langList: Array<MenuLangProps>
}

export type MenuUxProps = {
    regionId: string
    uxId: string
}

export type MenuUxList = Array<MenuUxProps>

export type MenuLangProps = {
    code: string
    name: string
}

export type MenuLangList = Array<MenuLangProps>

export type MenuLanguage = { name: string; defaultNm: string; code: string }

export type MenuRegion = { code: string; language: string }
