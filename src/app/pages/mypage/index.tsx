import React from "react"
import { DividerIcon, DividerPosition } from "@/components/layout/types"
import { useTranslation } from "react-i18next"
import { T_NAMESPACE, T_PREFIX } from "@/utils/resources/constants"
import Layer from "@/components/layout"
import MyPageTab from "./MyPageDetail"
import MyPageLoginLog from "./LoginLogDetail"
import "./styles.scss"

const MyPage = () => {
    const { t } = useTranslation(T_NAMESPACE.INTRO, { keyPrefix: T_PREFIX.MYPAGE })

    return (
        <section id="myPage">
            <Layer.Wrapper pageTitle={t("editProfile")} position={DividerPosition.horizon}>
                <Layer.Divider>
                    <Layer.DividerHeader icon={DividerIcon.settings} title={t("profile")} />
                    <MyPageTab />
                </Layer.Divider>
                <Layer.Divider>
                    <Layer.DividerHeader icon={DividerIcon.history} title={t("accessHistory")}>
                        <MyPageLoginLog />
                    </Layer.DividerHeader>
                </Layer.Divider>
            </Layer.Wrapper>
        </section>
    )
}

export default MyPage
