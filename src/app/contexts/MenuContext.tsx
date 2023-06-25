import { applyPath } from "@/utils/apis/request"
import { API } from "@/utils/apis/request.const"
import React, { createContext, ReactNode, useContext, useMemo, useState } from "react"
import { useRequest } from "./SendApiContext"
import { NodeItems, NodeProp, SectionPanel } from "@/utils/resources/types"

interface MenuState {
    menus: NodeItems | undefined
    mutateMenus?: () => void
    error?: unknown
    activeMenu?: NodeProp
    setActiveMenu?: React.Dispatch<React.SetStateAction<NodeProp>>
    sectionPanels?: SectionPanel[]
    setSectionPanels?: React.Dispatch<React.SetStateAction<SectionPanel[]>>
}

const initState: MenuState = {
    menus: [],
    mutateMenus: () => ({}),
    error: null,
    activeMenu: null,
    setActiveMenu: () => ({}),
    sectionPanels: [],
    setSectionPanels: () => ({}),
}

/** Side Menu Context */
const SMenuContext = createContext<MenuState>({ ...initState })
SMenuContext.displayName = "SIDE_MENU_CONTEXT"

export const useSMenu = () => useContext(SMenuContext)

/** Side menu State Provider */
export const SMenuStateProvider = React.memo(({ tMenu = null, children }: { tMenu: NodeProp | null; children: ReactNode }) => {
    const { usePost } = useRequest()
    const {
        data: menus,
        error,
        refetch: mutateMenus,
    } = usePost({ url: API.SIDE_MENUS, data: { parentId: tMenu?.id ?? "MENU100" } })
    

    // 현재 선택된 메뉴
    const [activeMenu, setActiveMenu] = useState<NodeProp | null>()

    // 현재 활성화 탭 목록
    const [sectionPanels, setSectionPanels] = useState<SectionPanel[]>([])

    const value = useMemo(
        () => ({
            menus,
            error,
            mutateMenus,
            activeMenu,
            setActiveMenu,
            sectionPanels,
            setSectionPanels,
        }),
        [menus, error, activeMenu, sectionPanels]
    )

    return <SMenuContext.Provider value={value}> {children} </SMenuContext.Provider>
})
