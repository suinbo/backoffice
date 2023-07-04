import React  from "react"
import Layer from "@/components/layout"
import { DividerPosition } from "@/components/layout/types"
import { T_NAMESPACE } from "@/utils/resources/constants"
import { useTranslation } from "react-i18next"
import CurationDetail from "./SectionDetail"
import "./styles.scss"

const Curation = () => {
    const { t } = useTranslation(T_NAMESPACE.MENU2)

    return (
        <div id="curation">
            <Layer.Wrapper pageTitle={t("cmsPage1")} position={DividerPosition.vertical}>
                <Layer.Divider>
                    <CurationDetail />
                </Layer.Divider>
            </Layer.Wrapper>
        </div>
    )
}

export default Curation
