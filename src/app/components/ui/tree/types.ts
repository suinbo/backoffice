import React, { ReactNode } from "react"

export type NodeId = string
export type NodeProp = object & { [key: string]: any }
export type NodeItems = Array<NodeProp>
export type OnNodeChangeProps = (node: NodeId, childNode: NodeId[]) => void

export interface RegionGroupNodeProp {
    isChecked?: boolean
    id: string
    leafs: Array<string>
    parentId: string
}

export interface MenuTree {
    [depth: number]: Array<RegionGroupNodeProp>
}

/**
 * TYPES OF TREE
 **/
export enum TreeTheme {
    lined = "lined",
    boxed = "boxed",
    expandOut = "expand-out",
    checkbox = "checkbox",
}

export interface Content {
    Content: React.FunctionComponent<NodeContentProp>
}

export interface RootContentProp {
    classList?: string | { isLeaf: boolean }
    nodeClick?: () => void
    children: React.ReactNode
}

export interface TreeRenderProps {
    selectAllTree: () => void
    expandAllTree: () => void
    expandedNodes: Array<NodeId>
    selectedNodes: Array<NodeId>
}

export interface TreeProps {
    keyName?: string
    nodes: NodeItems
    expandAll?: boolean
    activateNodeId?: NodeId | null
    checkedNodes?: Array<string>
    onClick?: (node: NodeProp) => void
    onActive?: (id: Array<NodeId>) => void
    onSelect?: (id: Array<NodeId>) => void
    onExpand?: (id: Array<NodeId>) => void
    nodeRenderer?: (props: NodeRendererProp) => ReactNode
    leafRenderer?: (props: LeafRendererProp) => ReactNode
    rootRenderer?: ((props: Content) => ReactNode) | null
    noDataString?: string
    theme?: TreeTheme | Array<TreeTheme>
    parentId?: string | null
    isMenu?: boolean
    children?: (props: Partial<TreeRenderProps>) => React.ReactNode
}

export type NodeProps = Partial<TreeProps> & {
    expandedNodes: Array<NodeId>
    selectedNodes: Array<NodeId>
    setSelectedNode?: React.Dispatch<React.SetStateAction<Array<NodeId>>>
    toggleSelect?: (id: NodeId) => void
    toggleExpand?: (id: NodeId) => void
    onNodeCheck?: (id: NodeProp) => (node: NodeId, childNode: NodeId[]) => void
    toggleActive: (id: NodeId) => void
    parentId: NodeId | null
    depth?: number
}

export interface NodeRendererProp extends Content {
    node: NodeProp
    isExpanded: boolean
    isRoot: boolean
    isLeaf: boolean
    isSelected: boolean
    depth: number
    isActiveNode: boolean
}

export interface NodeContentProp {
    classList?: string | { isLeaf: boolean }
    nodeClick?: (node: NodeProp) => void
    children: React.ReactNode
}

export type LeafProps = Partial<NodeProps> & {
    node: NodeProp
    depth: number
    isRoot?: boolean
    isExpanded?: boolean
    isSelected?: boolean
    onNodeChange?: OnNodeChangeProps
}

export interface LeafRendererProp extends Content {
    node: NodeProp
    isSelected: boolean
    isLeaf: boolean
    depth: number
}

export type groupMenuProp = {
    id: string
    parentId?: string
    menuId?: string
    viewYn?: boolean
    depth?: number
    leafs: Array<groupMenuProp>
}
