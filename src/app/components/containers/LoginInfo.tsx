import React, { useCallback } from "react"
import { Home, Input, Settings } from "@material-ui/icons"
import { useTranslation } from "react-i18next"
import { CUSTOM_MENUS, T_NAMESPACE } from "@/utils/resources/constants"
import { useNavigate } from "react-router-dom"
import { useSession } from "@/contexts/SessionContext"
import { convert2Utc } from "@/utils/common"
import { logoutProc } from "@/utils/apis/login"
import { useSMenu } from "@/contexts/MenuContext"
import { useConfirm } from "@/contexts/ConfirmContext"
import { ConfirmType } from "@/components/ui/confirm/types"
import { ButtonStyleType } from "@/components/ui/buttons/types"
import { NodeProp } from "@/components/ui/tree/types"

const LoginInfo = () => {
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
    const { activeMenu, setActiveMenu, sectionPanels, setSectionPanels } = useSMenu()
    const { setVisible, setOptions } = useConfirm()
    const { session } = useSession()
    const navigate = useNavigate()

    const onClickLogout = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        setOptions({
            type: ConfirmType.info,
            message: g("alert.logoutMessage"),
            buttonStyle: ButtonStyleType.primary,
            applyButtonMessage: g("button.ok"),
            onApply: () => {
                logoutProc()
            },
        })
        setVisible(true)
    }

    // Tab 이동
    const onChangeTab = useCallback(
        (tab: NodeProp & { menuNm: string }) => {
            setSectionPanels(panels => {
                setActiveMenu(tab)
                return panels
            })
        },
        [activeMenu, sectionPanels]
    )

    return (
        <div className="user-info">
            <ul className="user-button">
                <li onClick={() => navigate(0)}>
                    <Home className="home" />
                    <span>{"HOME"}</span>
                </li>
                <li onClick={() => onChangeTab({ ...CUSTOM_MENUS.MYPAGE, menuNm: g("editProfile") })}>
                    <Settings className="settings" />
                    <span>{g("editProfile")}</span>
                </li>
                <li onClick={onClickLogout}>
                    <Input className="input" />
                    <span>{"LOG OUT"}</span>
                </li>
            </ul>
            <div className="record">
                <span>{g("previousLogin")}</span>
                <span className="date">[{convert2Utc(session.loginTime)}]</span>
                <span className="ip">[{session.loginIp ?? "-"}]</span>
            </div>
        </div>
    )
}

export default React.memo(LoginInfo)
