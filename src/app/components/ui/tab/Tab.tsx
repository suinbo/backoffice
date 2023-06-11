import React, { useCallback, useMemo, useState } from "react"
import { CUSTOM_MENUS } from "@/utils/resources/constants"
import { Home } from "@material-ui/icons"
import cx from "classnames"
import "./styles.scss"
import { TabContentProp, TabDragPointProps, TabId, TabProp } from "./types"
import { NodeProp } from "@/utils/resources/types"

const MARGIN_WIDTH_SIZE = 100
const HALF = 2
const DRAG_START_ZINDEX = "3"
const DRAG_END_ZINDEX = "1"

/**
 * Tab Component
 * @param tab 단일 탭 객체
 * @param keyIndex 탭 Index
 * @param isSelected 현재 탭 활성 여부
 * @param onRemove 탭 제거 이벤트
 * @param onSelect 탭 선택 상태 변경
 * @param tabDraggable 탭 Drag&Drop
 * @param renderer 커스텀 탭 렌더러
 * @param hasCloseButton 탭 닫기 버튼 활성 여부
 * @param isMenuTab
 * @constructor
 */
const Tab = ({
    tab = null,
    keyIndex = 0,
    isSelected = false,
    onRemove,
    onSelect,
    tabDraggable,
    renderer = null,
    hasCloseButton = true,
    isMenuTab = false,
}: TabProp) => {
    if (tab == null) return null

    /**
     * @param clientX 탭 위치
     * @param screenX 탭 기준으로 마우스 좌/우 이동 확인
     * @param screenY 탭 기준으로 마우스 상/하 이동 확인
     */
    const [initPosition, setInitPosition] = useState<TabDragPointProps>({
        clientX: 0,
        screenX: 0,
        screenY: 0,
    })

    //dragPosition 드래그 시작 위치
    const [dragPosition, setDragPosition] = useState(0)

    const onRemoveTab = (e: React.MouseEvent, tabId: TabId) => {
        e.stopPropagation()
        onRemove && onRemove(tabId)
    }

    const onSelectTab = useCallback(
        (e: React.MouseEvent, tab: NodeProp) => {
            e.preventDefault()
            onSelect && onSelect(tab)
        },
        [onSelect]
    )

    const isRoot = useMemo(() => tab.id === CUSTOM_MENUS.HOME.id, [tab])
    const CancelButton = <span className="cancel-button" onClick={e => onRemoveTab(e, tab.id)} />
    const Content = ({ classList = "", children }: TabContentProp) => {
        return (
            <div className={cx("em-tab-data", classList)}>
                {isRoot && <Home className={cx("tab-icon home", { active: isSelected })} />}
                {children}
                {!isRoot && hasCloseButton && CancelButton}
            </div>
        )
    }

    const onTabClick = useCallback(
        (e: React.MouseEvent, tab: NodeProp) => {
            e.stopPropagation()
            onSelect && onSelectTab(e, tab)
        },
        [tab, onSelect]
    )

    /**
     * 탭 Drag&Drop 이벤트
     * @param keyIndex Drag한 탭 Index
     * @param pos Drag 선택한 탭의 Position 값
     */
    const hasDraggable = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            if (isMenuTab) {
                const { type, clientX, screenY, screenX, currentTarget } = e

                if (type === "dragstart") {
                    setInitPosition({ clientX, screenX, screenY })
                    currentTarget.style.zIndex = DRAG_START_ZINDEX
                    e.dataTransfer.setDragImage(new Image(), 0, 0)
                } else {
                    e.preventDefault() // 타입이 over 및 drop일 경우에 적용 (미적용시 Drop 적용이 안됨)
                    const sideBarWidth = document.getElementById("subMenu").offsetWidth // 사이드 바 Width 크기
                    const menuHeight = document.getElementsByClassName("top")[0].clientHeight // 대메뉴 칸 높이
                    const tabHeight = currentTarget.parentElement.parentElement.offsetHeight // 탭 칸 높이
                    const browserHeight = outerHeight - innerHeight // 브라우저의 탭, URL, 북마크 부분의 높이
                    const topHeight = menuHeight + tabHeight + browserHeight // 탭 메뉴 하단부터 브라우저 최상단까지의 높이

                    // 탭 기준으로 마우스 위치가 하단에 위치하는지 확인 (마우스가 하단에 있을 경우 clientX에서 사이드 메뉴만큼의 크기가 사라짐)
                    const isMouseDown = screenY >= topHeight

                    if (type === "drag") {
                        // 탭 위치 이동
                        setDragPosition(prev => {
                            const movePosition = clientX - initPosition.clientX // 마우스로 탭 이동한 위치
                            const diffPosition = Math.abs(movePosition - prev) // 이전 위치와의 차이 값
                            if (isMouseDown) {
                                // 마우스가 탭에서 하단에 위치할 경우
                                return Math.abs(diffPosition) > sideBarWidth - MARGIN_WIDTH_SIZE ? movePosition + sideBarWidth : movePosition
                            } else return movePosition
                        })
                    } else if (type === "dragend") {
                        // Drag가 끝난 탭의 위치로 Index 계산
                        const tabWidth = Math.floor(currentTarget.offsetWidth / HALF) // 탭 메뉴 크기의 절반 크기
                        const getLocation = initPosition.screenX - screenX // 마우스의 드래그 시작위치에서 종료위치를 뺀 값
                        const absLocation = Math.abs(getLocation) // getLocation의 절대값
                        if (absLocation >= tabWidth) {
                            // 탭 크기에서 반 이상 위치를 이동했을 경우만 탭 이동
                            const dropIndex = Math.floor((isMouseDown ? clientX : clientX - sideBarWidth) / currentTarget.offsetWidth)
                            if (dropIndex !== keyIndex) tabDraggable && tabDraggable(keyIndex, dropIndex >= 0 ? dropIndex : 0)
                        }

                        setDragPosition(0) // 드래그 이벤트 끝나면 위치 이동 초기화
                        currentTarget.style.zIndex = DRAG_END_ZINDEX
                    }
                }
            }
        },
        [keyIndex, initPosition]
    )

    return (
        <div
            style={{ left: dragPosition }}
            className={cx("em-tab-item", { active: isSelected })}
            onClick={e => onTabClick(e, tab)}
            draggable={isMenuTab}
            onDragStart={hasDraggable}
            onDrag={hasDraggable}
            onDragEnd={hasDraggable}
            onDragOver={e => e.preventDefault()}>
            {typeof renderer === "function" ? (
                renderer({ tab, isSelected, Content })
            ) : (
                <Content>
                    <span> {tab.title} </span>
                </Content>
            )}
        </div>
    )
}

export default Tab
