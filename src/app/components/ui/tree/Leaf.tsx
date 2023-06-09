import React, { useCallback, useMemo } from "react"
import cx from "classnames"
import { LeafProps, NodeContentProp, NodeProp, TreeTheme } from "@/components/ui/tree/types"
import Checkbox from "../forms/CheckBox"

/**
 * Leaf Component (최하위 노드)
 * @param keyName Id 분기용 키네임
 * @param node 최하위 렌더링 노드
 * @param depth 현재 depth
 * @param activateNodeId 활성화된 노드 아이디
 * @param onClick 노드 클릭 이벤트
 * @param toggleActive 활성 노드 변경 함수
 * @param toggleSelect 노드 선택 토글 이벤트
 * @param isSelected 현재 노드 선택 여부
 * @param leafRenderer 커스텀 노드 렌더러
 * @param theme 커스텀 클래스 이름
 * @param isMenu side메뉴 클릭이벤트 체크
 * @constructor
 */
const Leaf = ({
    keyName = "id",
    node = null,
    depth = 0,
    activateNodeId = null,
    onClick,
    toggleActive,
    toggleSelect,
    isSelected = false,
    leafRenderer = null,
    theme = TreeTheme.lined,
    isMenu = false,
}: LeafProps) => {
    if (node == null) return null

    /** 액티브인지 확인 */
    const isActiveNode = useMemo(() => {
        if (theme.includes(TreeTheme.checkbox)) return isSelected
        return activateNodeId == node[keyName]
    }, [activateNodeId, isSelected])

    const clickHandler = useCallback(
        (e: React.MouseEvent, node: NodeProp) => {
            // 체크 박스 테마일 시 상태 변경
            if (theme.includes(TreeTheme.checkbox)) toggleSelect && toggleSelect(node[keyName])
            if (!isMenu) toggleActive && toggleActive(node[keyName])
            onClick && onClick(node)
        },
        [node, activateNodeId, toggleActive, onClick, toggleSelect]
    )

    /** 커스텀 렌더러 HOC */
    const LeafContent = ({ classList = "", nodeClick, children }: NodeContentProp) => {
        const onNodeClick = useCallback(
            (e: React.MouseEvent, node) => {
                e.stopPropagation()
                clickHandler(e, node)
                nodeClick && nodeClick(node)
            },
            [node]
        )

        return (
            <div className={cx("em-tree-leaf", { active: isActiveNode }, classList)} onClick={e => onNodeClick(e, node)}>
                {theme.includes(TreeTheme.checkbox) && <Checkbox isChecked={isSelected} />}
                {children}
            </div>
        )
    }

    return (
        <>
            {typeof leafRenderer === "function" ? (
                leafRenderer({ node, isSelected, isLeaf: true, depth, Content: LeafContent })
            ) : (
                <LeafContent>
                    <span className={"em-tree-data"}> {node?.title} </span>
                </LeafContent>
            )}
        </>
    )
}

export default Leaf
