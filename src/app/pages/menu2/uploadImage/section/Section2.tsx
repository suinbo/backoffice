import React from "react"
import { T_NAMESPACE, T_PREFIX } from "@/utils/resources/constants"
import { useTranslation } from "react-i18next"
import { SectionImageProp } from "../types"
import { S3UploadFile } from "@/utils/aws/types"
import Section2ImageForm from "../wrapper/Section2ImageForm"
import { DetailSelectBoxItem } from "../../addContent/types"
import "../styles.scss"

/**
 * 섹션 2
 */
const Section2 = ({
    formItem,
    setFormItem,
    setS3UploadFiles
}: {
    formItem: SectionImageProp
    setFormItem: React.Dispatch<React.SetStateAction<SectionImageProp>>
    setS3UploadFiles: React.Dispatch<React.SetStateAction<Array<S3UploadFile>>>
} & Partial<DetailSelectBoxItem>) => {
    const { t } = useTranslation(T_NAMESPACE.MENU2, { keyPrefix: T_PREFIX.CURATION })

    return (
        <div id="section2" className="content-area form-group-shape content-organize">
            <div className="main-title-wrap">
                <h4>{t("section2")}</h4>
            </div>
            <Section2ImageForm
                imageInfo={{ imageList: formItem.section2Images, imageType: "directionType" }}
                formItem={formItem}
                setFormItem={setFormItem}
                setS3UploadFiles={setS3UploadFiles}
            />
        </div>
    )
}

export default Section2
