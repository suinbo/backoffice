import React from "react"
import { T_NAMESPACE, T_PREFIX } from "@/utils/resources/constants"
import { useTranslation } from "react-i18next"
import { CurationDetailProp, DetailSelectBoxItem } from "../types"
import { S3UploadFile } from "@/utils/aws/types"
import "../styles.scss"
import Section2ImageForm from "../wrapper/Section2ImageForm"

/**
 * 섹션 별 이미지 추가 > 섹션2
 * @param contentsType
 * @param formItem
 * @param setFormItem
 */
const Section2 = ({
    formItem,
    setFormItem,
    setS3UploadFiles
}: {
    formItem: CurationDetailProp
    setFormItem: React.Dispatch<React.SetStateAction<CurationDetailProp>>
    setS3UploadFiles: React.Dispatch<React.SetStateAction<Array<S3UploadFile>>>
} & Partial<DetailSelectBoxItem>) => {
    const { t } = useTranslation(T_NAMESPACE.MENU2, { keyPrefix: T_PREFIX.CURATION })

    return (
        <div className="content-area form-group-shape content-organize" id="section2">
            <div className="main-title-wrap">
                <h4>{t("section2")}</h4>
            </div>
            <Section2ImageForm
                imageInfo={{ imageList: formItem.images, imageType: "directionType" }}
                formItem={formItem}
                setFormItem={setFormItem}
                setS3UploadFiles={setS3UploadFiles}
            />
        </div>
    )
}

export default Section2
