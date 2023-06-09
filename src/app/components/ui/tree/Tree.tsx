import React, { useCallback, useEffect, useMemo, useState } from "react"
import cx from "classnames"
import "./styles.scss"
import NodeList from "./NodeList"
import { withTranslation } from "react-i18next"
import Checkbox from "../forms/CheckBox"
import { groupMenuProp, NodeId, NodeProp, RootContentProp, TreeProps, TreeTheme } from "@/components/ui/tree/types"

/** 디스패치 바인딩하여 외부 이벤트로 전달 */
const stateToggler = (setState: React.Dispatch<React.SetStateAction<NodeId[]>>, callback: (nodeIds: NodeId[]) => void, nodeId: NodeId): void => {
    setState(state => {
        let _state = state.slice() // swallow copied
        const findedIdx = _state.findIndex(id => id === nodeId)

        if (findedIdx != -1) _state = _state.filter(id => id !== nodeId)
        else _state.push(nodeId)

        callback && callback(_state)
        return _state
    })
}

/**
 * 트리 상태 및 이벤트 관리 컨테이너
 * @param keyName
 * @param nodes
 * @param expandAll 0: collapsed, 1: expanded
 * @param activateNodeId 활성 노드 아이디
 * @param checkedNodes 체크 노드 아이디
 * @param onClick 노드 클릭 이벤트
 * @param onSelect 노드 선택 이벤트 (TODO)
 * @param onExpand 노드 확장/축소 이벤트
 * @param nodeRenderer 커스텀 노드 템블릿 렌더러
 * @param leafRenderer 커스텀 최하위 노드 템블릿 렌더러
 * @param rootRenderer  최상위 노드 렌더러
 * @param theme 커스텀 클래스 이름
 * @param parentId 생성된 노드 id
 * @param children
 * @param isMenu side메뉴 클릭이벤트 체크용
 * @constructor
 */
const Tree = ({
    keyName = "id",
    nodes,
    expandAll = false,
    activateNodeId = null,
    checkedNodes = null,
    onClick,
    onSelect,
    onExpand,
    nodeRenderer = null,
    leafRenderer = null,
    rootRenderer = null,
    theme = TreeTheme.lined,
    parentId = null,
    children,
    isMenu = false,
}: TreeProps) => {
    const [activateNode, setActivateNode] = useState<NodeId | null>(null)
    const [selectedNodes, setSelectedNode] = useState<Array<NodeId>>([])
    const [expandedNodes, setExpandedNode] = useState<Array<NodeId>>([])
    const [allChecked, setAllChecked] = useState<boolean>(false)

    //전체 노드 ID
    const allNodes = useMemo(
        () =>
            nodes.reduce((acc, cur) => {
                acc.push(cur.id)
                !!cur.leafs &&
                    cur.leafs.map((item: groupMenuProp) => {
                        acc.push(item.id)
                        !!item.leafs &&
                            item.leafs.map((data: groupMenuProp) => {
                                acc.push(data.id)
                            })
                    })
                return acc
            }, []),
        [nodes]
    )

    useEffect(() => {
        if (checkedNodes) setSelectedNode(checkedNodes)
    }, [checkedNodes])

    useEffect(() => {
        if (expandAll) expandAllTree()
    }, [nodes])

    //노드 생성시 오픈
    useEffect(() => {
        if (parentId) setExpandedNode(prev => Array.from(new Set([...prev, parentId])))
    }, [parentId, nodes])

    const toggleSelect = useCallback(
        ids => {
            if (theme.includes(TreeTheme.checkbox)) {
                setSelectedNode(() => {
                    onSelect && onSelect(ids)
                    return ids
                })
            }
        },
        [selectedNodes, onSelect]
    )

    useEffect(() => {
        setActivateNode(activateNodeId)
    }, [activateNodeId])

    const onNodeActive = useCallback((id: NodeId) => setActivateNode(state => (state === id ? null : id)), [activateNode])
    const onNodeSelect = stateToggler.bind(null, setSelectedNode, onSelect)
    const onNodeExpand = stateToggler.bind(null, setExpandedNode, onExpand)

    useEffect(() => {
        const isContain = selectedNodes.filter(item => allNodes.includes(item)).length == allNodes.length
        setAllChecked(isContain)
    }, [selectedNodes, allNodes])

    const selectAllTree = useCallback(() => {
        setSelectedNode(() => {
            const setNodes: any = !allChecked ? allNodes : []
            onSelect(setNodes)
            return [...setNodes]
        })
    }, [selectedNodes, allChecked])

    const expandAllTree = () => {
        expandAll &&
            setExpandedNode(() => {
                const expandedNodes = nodes
                    .map(node => {
                        return [node[keyName]].concat(node.leafs ? node.leafs.map((leaf: NodeProp) => leaf[keyName]) : [])
                    })
                    .flatMap(id => id)

                onExpand && onExpand(expandedNodes)
                return expandedNodes
            })
    }

    const RootContent = ({ classList = "", nodeClick, children }: RootContentProp) => {
        const onNodeClick = useCallback(
            (e: React.MouseEvent) => {
                e.stopPropagation()
                nodeClick && nodeClick()
                setAllChecked(!allChecked)
                expandAll && selectAllTree()
            },
            [nodes, allChecked]
        )

        return (
            <div
                onClick={onNodeClick}
                className={cx("em-tree-root", { active: (theme.includes(TreeTheme.checkbox) && allChecked) || !!activateNodeId }, classList)}>
                {theme.includes(TreeTheme.checkbox) && <Checkbox isChecked={allChecked} />}
                {children}
            </div>
        )
    }

    return (
        <div className="em-tree-container">
            <div className={cx("em-tree", theme)}>
                {typeof rootRenderer === "function" && rootRenderer({ Content: RootContent })}
                <NodeList
                    keyName={keyName}
                    nodes={nodes}
                    selectedNodes={selectedNodes}
                    expandedNodes={expandedNodes}
                    activateNodeId={activateNode}
                    onClick={onClick}
                    toggleSelect={onNodeSelect}
                    toggleExpand={onNodeExpand}
                    toggleActive={onNodeActive}
                    setSelectedNode={toggleSelect}
                    parentId={null}
                    nodeRenderer={nodeRenderer}
                    leafRenderer={leafRenderer}
                    theme={theme}
                    isMenu={isMenu}
                />
            </div>
            {typeof children === "function" &&
                children({
                    selectAllTree,
                    expandAllTree,
                    expandedNodes,
                    selectedNodes,
                })}
        </div>
    )
}

export default withTranslation()(Tree)
