import React, { useCallback, useEffect, useMemo } from "react"
import cx from "classnames"
import { LeafProps, NodeContentProp, NodeId, NodeProp, TreeTheme } from "@/components/ui/tree/types"
import Checkbox from "../forms/CheckBox"

/**
 * Node Component (2depth Node)
 * @param keyName
 * @param node  렌더링 될 노드
 * @param depth 현재 Depth
 * @param isRoot 상위 노드 존재 유무
 * @param activateNodeId  활성화된 노드 아이디
 * @param toggleActive 활성 노드 변경 함수
 * @param toggleSelect  노드 선택 토글 이벤트
 * @param toggleExpand 노드 확장 토글 이벤트
 * @param isExpanded  현재 노드 확장 여부
 * @param isSelected  현재 노드 선택 여부
 * @param setSelectedNode 선택된 노드 변경
 * @param selectedNodes 선택된 노드 리스트
 * @param nodeRenderer  커스텀 노드 렌더러
 * @param theme 커스텀 클래스 이름
 * @constructor
 */
const Node = ({
    keyName = "id",
    node = null,
    depth = 0,
    isRoot = false,
    activateNodeId = null,
    toggleActive,
    toggleSelect,
    toggleExpand,
    isExpanded = false,
    isSelected = false,
    setSelectedNode,
    selectedNodes = [],
    nodeRenderer = null,
    theme = TreeTheme.lined,
}: LeafProps) => {
    if (node == null) return null
    const allLeafs: NodeId[] = useMemo(
        () =>
            node.leafs
                ?.map((nodeItems: NodeProp) =>
                    [nodeItems[keyName]]
                        .concat(nodeItems.leafs ? nodeItems.leafs.map((leaf: NodeProp) => leaf[keyName]) : [])
                        .concat(nodeItems.leafs ? nodeItems.leafs.map((leaf: NodeProp) => leaf[keyName]) : [])
                )
                .flatMap((id: NodeId) => id) ?? [],
        [node]
    )

    /**
     * 자식 노드중 하나라도 체크상태인지 여부
     */
    const hasChildChecked = useMemo(() => {
        return allLeafs.some((id: NodeId) => selectedNodes.includes(id ?? ""))
    }, [selectedNodes])

    // 전체 자식 노드 선택/해제
    const toggleParentSelect = useCallback(
        (id: NodeId) => {
            let result = null
            if (isSelected) {
                //leaf와 본인 제외 모두선택
                result = selectedNodes.filter(item => !allLeafs.includes(item) && item != id)
            } else {
                //leaf와 본인 포함 선택
                result = selectedNodes.concat([...allLeafs, id])
            }
            setSelectedNode(Array.from(new Set(result)))
        },
        [selectedNodes]
    )

    // if childChecked XOR parentSelected then toggle
    useEffect(() => {
        if (!theme.includes(TreeTheme.checkbox)) return
        if (hasChildChecked !== isSelected) toggleSelect(node[keyName] as string)
    }, [selectedNodes])

    /** 활성화 노드 검사 (자식 노드 포함) */
    const isActiveNode = useMemo((): boolean => {
        if (!activateNodeId) return false
        return activateNodeId == node[keyName] || allLeafs.includes(activateNodeId)
    }, [activateNodeId, node])

    /** 상위 노드 클릭 이벤트 핸들러 */
    const clickHandler = (e: React.MouseEvent, nodeId: NodeId) => {
        e.preventDefault()
        e.stopPropagation()
        // 체크 박스 테마일 시 상태 변경
        if (theme.includes(TreeTheme.checkbox)) toggleParentSelect(nodeId)
        // 외부 확장 토글 테마일 시 액션 변경
        if (theme.includes(TreeTheme.expandOut)) toggleActive(nodeId)
        else toggleExpand(nodeId)
    }

    /** 외부 확장 토글 버튼 */
    const ExpandButton = (
        <div className={cx("em-tree-expand-toggle", { expanded: isExpanded })} onClick={() => toggleExpand(node[keyName] as string)} />
    )

    const NodeContent: React.FunctionComponent<NodeContentProp> = ({ classList = "", nodeClick, children }: NodeContentProp) => {
        const onNodeClick = useCallback(
            (e: React.MouseEvent, node: NodeProp) => {
                e.stopPropagation()
                clickHandler(e, node.id as NodeId)
                nodeClick && nodeClick(node)
            },
            [node]
        )

        return (
            <div
                onClick={e => onNodeClick(e, node)}
                className={cx(
                    "em-tree-item",
                    {
                        active: theme.includes(TreeTheme.checkbox) ? isSelected : isActiveNode,
                        expanded: isExpanded,
                        selected: !theme.includes(TreeTheme.checkbox) && isSelected,
                        isRoot: isRoot,
                    },
                    `depth${depth}`,
                    classList
                )}>
                {theme.includes(TreeTheme.checkbox) && <Checkbox isChecked={isSelected} />}
                {children}
            </div>
        )
    }

    return (
        <>
            {theme.includes(TreeTheme.expandOut) && allLeafs.length > 0 && ExpandButton}
            {typeof nodeRenderer === "function" ? (
                nodeRenderer({
                    node,
                    isExpanded,
                    isLeaf: !allLeafs.length,
                    isRoot,
                    isSelected,
                    depth,
                    isActiveNode,
                    Content: NodeContent,
                })
            ) : (
                <NodeContent>
                    <span className="em-tree-data"> {node?.title} </span>
                </NodeContent>
            )}
        </>
    )
}

export default Node
