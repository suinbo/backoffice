import React, { useState } from "react"
import Layer from "@/components/layout"
import { DividerPosition } from "@/components/layout/types"
import FAQList from "@/pages/site/faq/faqList/FAQList"
import FAQSearch from "@/pages/site/faq/faqList/FAQSearch"
import { T_NAMESPACE } from "@/utils/resources/constants"
import { useTranslation } from "react-i18next"
import { defaultRequestData } from "../const"
import { FAQRequesDataProp } from "./types"
import "react-datepicker/dist/react-datepicker.css"
import "./styles.scss"

const Faq = () => {
    const { t } = useTranslation(T_NAMESPACE.FAQ)
    const [requestData, setRequestData] = useState<FAQRequesDataProp>(defaultRequestData)

    return (
        <div id="faqPage">
            <Layer.Wrapper pageTitle={t("faqList")} position={DividerPosition.vertical}>
                <Layer.Divider>
                    <FAQSearch requestData={requestData} setRequestData={setRequestData} />
                </Layer.Divider>
                <Layer.Divider>
                    <FAQList requestData={requestData} setRequestData={setRequestData} />
                </Layer.Divider>
            </Layer.Wrapper>
        </div>
    )
}

export default Faq
