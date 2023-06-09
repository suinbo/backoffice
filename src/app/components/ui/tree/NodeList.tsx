import React, { useCallback } from "react"
import Node from "./Node"
import Leaf from "./Leaf"
import cx from "classnames"
import { NodeProp, NodeProps, TreeTheme } from "@/components/ui/tree/types"

/**
 * 노드 배열 렌더링 제어
 * @param keyName id 분기용 keyName
 * @param nodes 하위 Depth 포함한 모든 노드 리스트
 * @param parentId 부모 노드 아이디
 * @param depth 현재 Depth
 * @param activateNodeId 활성된 노드 아이디
 * @param onClick 노드 클릭 이벤트
 * @param toggleSelect 노드 선택 토글 이벤트
 * @param toggleExpand 노드 확장 토글 이벤트
 * @param toggleActive 활성 노드상태 변경
 * @param expandedNodes 확장된 노드 리스트
 * @param selectedNodes 선택된 노드 리스트
 * @param setSelectedNode 선택된 노드 변경
 * @param nodeRenderer 커스텀 노드 템플릿 렌더러
 * @param leafRenderer 커스텀 최하위 노드 템블릿 렌더러
 * @param theme 커스텀 클래스 이름
 * @param isMenu side메뉴 클릭이벤트 체크
 * @constructor
 */
const NodeList = ({
    keyName = "id",
    nodes = [],
    parentId = null,
    depth = 0,
    activateNodeId = null,
    onClick,
    toggleSelect,
    toggleExpand,
    toggleActive,
    expandedNodes = [],
    selectedNodes = [],
    setSelectedNode,
    nodeRenderer = null,
    leafRenderer = null,
    theme = TreeTheme.lined,
    isMenu = false,
}: NodeProps) => {
    /** 최하위 노드 여부 검사 */
    const isLowestReaf = useCallback((leaf: NodeProp): boolean | null => !(leaf.leafs && leaf.leafs.length), [nodes])

    return (
        <>
            {!!nodes.length &&
                nodes.map((item: NodeProp, idx: number) => {
                    return (
                        <div className={cx("em-tree-group", `depth${depth}`)} key={idx}>
                            <Node
                                keyName={keyName}
                                node={item}
                                depth={depth}
                                isRoot={!parentId}
                                activateNodeId={activateNodeId}
                                toggleActive={toggleActive}
                                toggleSelect={toggleSelect}
                                toggleExpand={toggleExpand}
                                setSelectedNode={setSelectedNode}
                                isExpanded={expandedNodes.includes(item[keyName])}
                                isSelected={selectedNodes.includes(item[keyName])}
                                selectedNodes={selectedNodes}
                                parentId={parentId}
                                nodeRenderer={nodeRenderer}
                                theme={theme}
                            />
                            {expandedNodes.includes(item[keyName]) &&
                                item.leafs &&
                                item.leafs.map((leaf: NodeProp) =>
                                    !isLowestReaf(leaf) ? (
                                        <NodeList
                                            keyName={keyName}
                                            key={`nodes_${leaf[keyName]}`}
                                            nodes={[leaf]}
                                            activateNodeId={activateNodeId}
                                            expandedNodes={expandedNodes}
                                            selectedNodes={selectedNodes}
                                            setSelectedNode={setSelectedNode}
                                            onClick={onClick}
                                            toggleSelect={toggleSelect}
                                            toggleExpand={toggleExpand}
                                            toggleActive={toggleActive}
                                            leafRenderer={leafRenderer}
                                            nodeRenderer={nodeRenderer}
                                            parentId={item[keyName]}
                                            depth={depth + 1}
                                            theme={theme}
                                        />
                                    ) : (
                                        <Leaf
                                            keyName={keyName}
                                            key={`leaf_${leaf[keyName]}`}
                                            node={leaf}
                                            depth={depth + 1}
                                            onClick={onClick}
                                            activateNodeId={activateNodeId}
                                            parentId={item[keyName]}
                                            toggleActive={toggleActive}
                                            leafRenderer={leafRenderer}
                                            toggleSelect={toggleSelect}
                                            isSelected={selectedNodes.includes(leaf[keyName])}
                                            theme={theme}
                                            isMenu={isMenu}
                                        />
                                    )
                                )}
                        </div>
                    )
                })}
        </>
    )
}

export default NodeList
