import React, { ReactNode } from "react"
import { NodeItems, NodeProp, SectionPanel } from "@/utils/resources/types"

export type TabId = string | null

/**
 * TYPES OF TAB
 **/
export enum TabTheme {
    lined = "lined",
    boxed = "boxed",
}

export interface TabProps {
    tabs: NodeItems
    selectedTab?: TabId
    onRemove?: (id: TabId, tabList?: Partial<SectionPanel>[]) => void
    onSelect: (Tab: NodeProp) => void
    tabDraggable?: (prevIdx: number, curIdx: number) => void
    renderer?: (({ tab, isSelected, Content }: { tab: NodeProp; isSelected?: boolean; Content?: ReactNode }) => ReactNode) | null
    hasCloseButton?: boolean
    theme?: TabTheme
    isMenuTab?: boolean
    useMemoization?: boolean // 탭 메모제이션 사용여부
}

export type TabProp = Partial<TabProps> & {
    tab: NodeProp
    isSelected: boolean
    keyIndex: number
}

export interface TabContentProp {
    classList?: string
    nodeClick?: (tab: NodeProp) => void
    children: React.ReactNode
}

export interface TabDragPointProps {
    clientX: number
    screenX: number
    screenY: number
}

export type TabViewProp = {
    id: string
    component?: string | ReactNode
}

export interface TabViewProps {
    tabViews: Array<TabViewProp>
    activeView: string
}
