import { useSMenu } from "@/contexts/MenuContext"
import React, { useCallback, useEffect } from "react"
import Dashboard from "@/pages/default/home"
import cx from "classnames"
import { useToolTip } from "@/contexts/ToolTipContext"
import { Tabs } from "../ui/tab"
import { NodeProp, SectionPanel } from "@/utils/resources/types"
import { TabId, TabTheme } from "../ui/tab/types"
import { UX_MAPPER } from "@/utils/resources/constants"

/** Common Body Content */
const Body = () => {
    const { activeMenu, setActiveMenu, sectionPanels, setSectionPanels } = useSMenu()
    //const { setHideRegionSelect, region } = useRegion()
    const { setOnMouse, tooltipHandler } = useToolTip()

    console.log("sectionPanels:: ", sectionPanels)

    // 탭 선택 이벤트
    const onSelectTab = useCallback((tab: SectionPanel) => {
        setActiveMenu(tab)
        //setHideRegionSelect(GLOBAL_MENU.includes(tab.id))
    }, [])

    // 이미 존재하는 탭 여부 확인
    const isExistPanel = useCallback(id => !!sectionPanels.find((panel: SectionPanel) => panel.id == id), [sectionPanels])

    // 메뉴 선택 시
    useEffect(() => {
        if (activeMenu) {
            //setHideRegionSelect(GLOBAL_MENU.includes(activeMenu.uxId as string))
            if (!isExistPanel(activeMenu?.id) || activeMenu.update) {
                setSectionPanels(panels => [
                    ...panels,
                    {
                        id: activeMenu.id as string,
                        uxId: activeMenu?.uxId as string,
                        menuNm: activeMenu.menuNm as string,
                        url: (activeMenu.url ?? UX_MAPPER[activeMenu.uxId as keyof typeof UX_MAPPER]) as string,
                    },
                ])
            }
        } else {
            setActiveMenu(null)
            //setHideRegionSelect(false)
        }
    }, [activeMenu])

    // // top menu 리전 변경시 탭 초기화
    // useEffect(() => {
    //     setSectionPanels([])
    //     setActiveMenu(null)
    // }, [region])

    // 탭 제거 이벤트
    const onRemoveTab = useCallback(
        (id: TabId, tabList: Array<SectionPanel>) => {
            const idx = tabList.findIndex(tab => tab.id === id)
            setOnMouse(false)
            // 마지막 탭 제거 시 마지막 인덱스 포커싱
            // 중간 탭 제거 후 오른쪽 탭으로 포커싱 이동
            setSectionPanels(() => {
                const filtered = tabList.filter((panel: SectionPanel) => panel.id !== id)
                if (id === activeMenu.id) {
                    const subCount = filtered[idx] ? 0 : 1
                    setActiveMenu(filtered[idx - subCount])
                }

                return filtered
            })
        },
        [activeMenu, sectionPanels]
    )

    const tabRenderer = useCallback(
        ({ tab, Content }: { tab: NodeProp; Content: React.ComponentType }) => {
            return (
                <Content>
                    <span onMouseEnter={e => tooltipHandler(e, true, tab.menuNm as string)} onMouseLeave={() => setOnMouse(false)}>
                        {tab.menuNm}
                    </span>
                </Content>
            )
        },
        [activeMenu]
    )

    return (
        <>
            {/* 선택된 메뉴 없을 경우 기본 인트로 이미지 노출 */}
            {!sectionPanels.length ? (
                <Dashboard />
            ) : (
                <section id="container">
                    <div className="menu-tabs">
                        <Tabs
                            tabs={sectionPanels}
                            renderer={tabRenderer}
                            selectedTab={activeMenu?.id as string}
                            onRemove={onRemoveTab}
                            onSelect={onSelectTab}
                            theme={TabTheme.boxed}
                            isMenuTab={true}
                        />
                    </div>
                    {sectionPanels.map((panel: SectionPanel) => {
                        return (
                            <div key={panel.id} className={cx("em-panel", { show: activeMenu?.id == panel.id })}>
                                <iframe key={panel.id} src={panel.url} />
                            </div>
                        )
                    })}
                </section>
            )}
        </>
    )
}

export default React.memo(Body)
