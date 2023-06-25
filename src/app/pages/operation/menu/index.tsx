import React, { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { DividerIcon, DividerPosition } from "@/components/layout/types"
import { T_NAMESPACE, T_PREFIX } from "@/utils/resources/constants"
import { MenuStateType } from "./types"
import Layer from "@/components/layout"
import MenuDetail from "./MenuDetail"
import MenuList from "./MenuList"
import Blind from "@/components/ui/blind"
import "@/components/ui/forms/styles.scss"
import "./styles.scss"

const defaultMenuProp: MenuStateType = {
    menuId: null,
    depth: 0,
    hasLeafs: false,
    nodeId: null,
    viewYn: false,
}

const Menu = () => {
    const { t } = useTranslation(T_NAMESPACE.MENU1, { keyPrefix: T_PREFIX.TREE })

    /** 선택된 메뉴 */
    const [menuState, setMenuState] = useState<MenuStateType>({ ...defaultMenuProp })

    /** 메뉴 상태 세팅 */
    const setState = useCallback((menuState: MenuStateType) => setMenuState(prev => ({ ...prev, ...menuState })), [])

    /** 해당 ID 상세 오픈 및 같은 항목 클릭시 상세 닫기 */
    const setfilteredState = useCallback(
        (menuState: MenuStateType) =>
            setMenuState(prev => {
                menuState.menuId = prev.menuId === menuState.menuId ? null : menuState.menuId
                menuState.nodeId = prev.nodeId === menuState.nodeId ? null : menuState.nodeId
                return { ...prev, ...menuState }
            }),
        []
    )

    return (
        <section id="manuPage">
            <Layer.Wrapper position={DividerPosition.horizon} pageTitle={t("tree")}>
                <Layer.Divider>
                    <Layer.DividerHeader icon={DividerIcon.format} title={t("treeList")} />
                    <div className="body-title"> {t("menuList")} </div>
                    <MenuList menuState={menuState} setMenuState={setfilteredState} />
                </Layer.Divider>
                <Layer.Divider>
                    <Layer.DividerHeader icon={DividerIcon.info} title={t("treeDetail")} />
                    <div className="body-title"> {t("menuDetail")} </div>
                    {menuState.menuId ? <MenuDetail menuState={menuState} setMenuState={setState} /> : <Blind text={t("dtailEmptyMsg")} />}
                </Layer.Divider>
            </Layer.Wrapper>
        </section>
    )
}

export default React.memo(Menu)
