import React, { useCallback, useMemo, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSMenu } from "@/contexts/MenuContext"
import { MESSAGE_TYPE, NUMBER, T_NAMESPACE } from "@/utils/resources/constants"
import { useToolTip } from "@/contexts/ToolTipContext"
import { useConfirm } from "@/contexts/ConfirmContext"
import { ConfirmType } from "@/components/ui/confirm/types"
import { ButtonStyleType } from "@/components/ui/buttons/types"
import iconSelector from "@/components/icon"
import cx from "classnames"
import "./styles.scss"
import { Tree } from "../ui/tree"
import { NodeProp, SectionPanel } from "@/utils/resources/types"
import { LeafRendererProp, NodeRendererProp, TreeTheme } from "../ui/tree/types"

/** 사이드 메뉴 */
const Aside = () => {
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
    const { tooltipHandler, setOnMouse } = useToolTip()
    const { setVisible, setOptions } = useConfirm()
    const { menus, activeMenu, setActiveMenu, sectionPanels, setSectionPanels } = useSMenu()
    const [foldSidebar, setFoldSidebar] = useState(false)

    console.log("menus:: ", menus)

    // iframe 내부에서 탭 수신
    // useEffect(() => {
    //     const messageSender = (e: MessageEvent<SectionPanel>) => {
    //         const { data } = e

    //         if (data?.type === MESSAGE_TYPE.TAB) {
    //             setSectionPanels(panels => {
    //                 if (panels.find(panel => panel.id === data.id)) {
    //                     setOptions({
    //                         type: ConfirmType.info,
    //                         message: g(`alert.${data.update ? "moveTabConfirm" : "moveTabAlert"}`, { val: data.menuNm }),
    //                         buttonStyle: ButtonStyleType.primary,
    //                         applyButtonMessage: g("button.ok"),
    //                         onApply: () => {
    //                             onNodeClick(data)
    //                         },
    //                     })
    //                     setVisible(true)
    //                 } else {
    //                     onNodeClick(data)
    //                 }
    //                 return panels
    //             })
    //         }
    //     }
    //     window.addEventListener("message", messageSender, false)
    //     return () => {
    //         window.removeEventListener("message", messageSender, false)
    //     }
    // }, [menus, sectionPanels])

    // // 노드 클릭 시 해당 메뉴를 저장
    const onNodeClick = useCallback((menu: NodeProp) => {
        if (menu.viewYn) {
            setSectionPanels((panels: SectionPanel[]) => {
                // 선택한 TAB이 10개 이상이거나 기존에 선택했었는지 확인
                // 메뉴 권한이 없는 메뉴 클릭시 접근 불가
                if ((panels.length >= NUMBER.MAXIMUM_TAB_SIZE && !!panels.every(tab => tab.id !== menu.id)) || menu.vdiYn) {
                    setOptions({
                        type: ConfirmType.alert,
                        message: menu.vdiYn ? g("alert.auth", { menu: menu.menuNm as string }) : g("alert.maxSize"),
                        buttonStyle: ButtonStyleType.default,
                        applyButtonMessage: g("button.ok"),
                    })
                    setVisible(true)
                } else {
                    setActiveMenu(menu)
                }
                return menu.update ? panels.filter(panel => panel.id !== menu.id) : panels
            })
        }
    }, [])

    const leafRenderer = useCallback(
        ({ node, Content }: LeafRendererProp) => (
            <Content>
                <span className="em-tree-data"> {node.menuNm} </span>
            </Content>
        ),
        []
    )

    const nodeRenderer = useCallback(({ node, isActiveNode, Content, isRoot }: NodeRendererProp) => {
        return (
            <Content nodeClick={() => onNodeClick(node)} classList={{ isLeaf: node.viewYn as boolean }}>
                {isRoot && iconSelector(node.id as string, isActiveNode)}
                <span className="em-tree-data" onMouseEnter={e => tooltipHandler(e, true, g(node.menuNm))} onMouseLeave={() => setOnMouse(false)}>
                    {g(node.menuNm)}
                </span>
            </Content>
        )
    }, [])

    return useMemo(
        () => (
            <aside id="subMenu" className={cx({ fold: foldSidebar })}>
                {!!menus && (
                    <Tree
                        nodes={menus}
                        nodeRenderer={nodeRenderer}
                        leafRenderer={leafRenderer}
                        activateNodeId={activeMenu?.id as string}
                        expandAll={false}
                        theme={TreeTheme.lined}
                        onClick={onNodeClick}
                        isMenu={true}
                    />
                )}
                <div className="side-menu" onClick={() => setFoldSidebar(toggle => !toggle)} />
            </aside>
        ),
        [menus, activeMenu, sectionPanels, foldSidebar]
    )
}

export default Aside
