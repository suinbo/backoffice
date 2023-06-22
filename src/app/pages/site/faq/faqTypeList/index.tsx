import React from "react"
import Layer from "@/components/layout"
import { DividerPosition } from "@/components/layout/types"
import FaqManagementList from "./FaqTypeList"
import { useTranslation } from "react-i18next"
import { T_NAMESPACE } from "@/utils/resources/constants"
import "./styles.scss"

/**
 * FAQ - 자주찾는 질문
 * @constructor
 */
const FAQManagement = () => {
    const { t } = useTranslation(T_NAMESPACE.FAQ)

    return (
        <div id="faqManagement">
            <Layer.Wrapper pageTitle={t("frequentlyAskedMgmt")} position={DividerPosition.vertical}>
                <Layer.Divider>
                    <FaqManagementList />
                </Layer.Divider>
            </Layer.Wrapper>
        </div>
    )
}

export default FAQManagement
