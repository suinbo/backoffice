import React, { useCallback, useMemo } from "react"
import FormItem from "@/components/ui/forms/FormItem"
import Radio, { RadioProps } from "@/components/ui/forms/Radio"
import { T_NAMESPACE, T_PREFIX } from "@/utils/resources/constants"
import { useTranslation } from "react-i18next"
import { CurationDetailProp } from "../types"
import { S3UploadFile } from "@/utils/aws/types"
import { HORIZONTAL, VERTICAL } from "../const"
import { CONTENT_IMAGE_TYPE } from "../../addContent/const"
import Section3ImageForm from "../wrapper/Section3ImageForm"
import "../styles.scss"

/**
 * 큐레이션 상세 > 부가정보
 * @param
 */
const CurationDetailEtc = ({
    formItem,
    setFormItem,
    setS3UploadFiles,
}: {
    formItem: CurationDetailProp
    setFormItem: React.Dispatch<React.SetStateAction<CurationDetailProp>>
    setS3UploadFiles: React.Dispatch<React.SetStateAction<Array<S3UploadFile>>>
}) => {
    const { t } = useTranslation(T_NAMESPACE.MENU2, { keyPrefix: T_PREFIX.CURATION })
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)

    const useImageRadio = useMemo(
        (): RadioProps<any, any>[] => [
            {
                id: "disabled",
                title: g("label.useN"),
                value: 0,
            },
            {
                id: "enabled",
                title: g("label.useY"),
                value: 1,
            },
        ],
        []
    )

    /** 사용여부 변경 */
    const onRadioChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation()
        const { name, value } = e.target
        setFormItem(prev => ({
            ...prev,
            [name]: Boolean(Number(value)),
            images: [],
        }))

        setS3UploadFiles(prev => prev.filter(item => ![HORIZONTAL, VERTICAL].includes(item.option)))
    }, [])

    return (
        <div id={"section3"} className="content-area form-group-shape">
            <div className="main-title-wrap">
                <h4>{t("section3")}</h4>
            </div>
            {/** 상단 이미지 사용여부 */}
            <FormItem title={t("useImageYN")} customClassName={["top-line"]} required={true} tooltip={t("tooltipImageUseYn")}>
                <Radio
                    key="imageYn"
                    name="imageYn"
                    list={useImageRadio}
                    data={useImageRadio.find(item => Boolean(item.value) == formItem.imageYn)?.id}
                    onChange={onRadioChange}
                />
            </FormItem>
            {/** 이미지 */}
            {formItem.imageYn && (
                <Section3ImageForm
                    imageInfo={{ imageList: formItem.contentImages, imageType: CONTENT_IMAGE_TYPE }}
                    formItem={formItem}
                    setFormItem={setFormItem}
                    setS3UploadFiles={setS3UploadFiles}
                />
            )}
        </div>
    )
}

export default CurationDetailEtc
