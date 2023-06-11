import React, { useCallback, useEffect, useState } from "react"
import { NodeProp, SectionPanel } from "@/utils/resources/types"
import cx from "classnames"
import Tab from "./Tab"
import "./styles.scss"
import { TabId, TabProps, TabTheme } from "./types"

/**
 * Tab List Component
 * @param tabs  진열된 탭 리스트
 * @param selectedTab 현재 활성 탭 아이디
 * @param onRemove 탭 제거 이벤트
 * @param onSelect  탭 선택 이벤트
 * @param renderer  커스텀 탭 렌더러
 * @param hasCloseButton 탭 닫기 버튼 활성 여부
 * @param theme 커스텀 클래스 이름
 * @param isMenuTab
 * @param useMemoization  탭 메모제이션 (이전탭과 신규탭 합치기 사용 여부)
 * @constructor
 */
const Tabs = ({
    tabs = null,
    selectedTab = null,
    onRemove,
    onSelect,
    renderer = null,
    hasCloseButton = true,
    theme = TabTheme.lined,
    isMenuTab = false,
    useMemoization = true,
}: TabProps) => {
    const [tabList, setTabList] = useState<Partial<SectionPanel>[]>([...tabs])

    useEffect(() => {
        // Drag&Drop으로 순서 변경된 내용 반영해서 탭 설정
        if (useMemoization) {
            setTabList(prev => {
                const prevTabId = [...prev].map(item => item.id)
                const addTab = [...tabs].filter(item => !prevTabId.includes(item.id))
                return [...prev, ...addTab]
            })
        } else {
            setTabList([...tabs])
        }
    }, [tabs, useMemoization])

    // 탭 Drag&Drop 순서 변경
    const setTabChange = useCallback((tabList: Partial<SectionPanel>[], dragIndex: number, dropIndex: number) => {
        const changeList = [...tabList]
        const dragValue = changeList.splice(dragIndex, 1)
        changeList.splice(dropIndex, 0, dragValue[0])
        return changeList
    }, [])

    // 탭 Drag&Drop 적용
    const tabDragHandler = useCallback((dragIndex: number, dropIndex: number) => {
        setTabList(prev => setTabChange(prev, dragIndex, dropIndex))
    }, [])

    const onRemoveTab = useCallback(
        (tabId: TabId) => {
            onRemove && onRemove(tabId, tabList)
            setTabList(prev => {
                return [...prev].filter(item => item.id !== tabId)
            })
        },
        [selectedTab, tabList, onRemove]
    )

    return (
        <div className={cx("em-tabs", theme)}>
            {tabList?.map((tab: NodeProp, index: number) => (
                <Tab
                    key={tab.id}
                    keyIndex={index}
                    tab={tab}
                    renderer={renderer}
                    isSelected={selectedTab == tab.id}
                    onSelect={onSelect}
                    onRemove={(tabId: TabId) => onRemoveTab(tabId)}
                    hasCloseButton={hasCloseButton}
                    tabDraggable={tabDragHandler}
                    isMenuTab={isMenuTab}
                />
            ))}
        </div>
    )
}

export default React.memo(Tabs)
