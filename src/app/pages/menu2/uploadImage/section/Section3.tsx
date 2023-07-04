import React, { useCallback, useMemo } from "react"
import FormItem from "@/components/ui/forms/FormItem"
import Radio, { RadioProps } from "@/components/ui/forms/Radio"
import { T_NAMESPACE, T_PREFIX } from "@/utils/resources/constants"
import { useTranslation } from "react-i18next"
import { SectionImageProp } from "../types"
import { S3UploadFile } from "@/utils/aws/types"
import { HORIZONTAL, VERTICAL } from "../const"
import { CONTENT_IMAGE_TYPE } from "../../addContent/const"
import Section3ImageForm from "../wrapper/Section3ImageForm"
import "../styles.scss"

/**
 * 섹션 3
 */
const Section3 = ({
    formItem,
    setFormItem,
    setS3UploadFiles,
}: {
    formItem: SectionImageProp
    setFormItem: React.Dispatch<React.SetStateAction<SectionImageProp>>
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
        <div id="section3" className="content-area form-group-shape">
            <div className="main-title-wrap">
                <h4>{t("section3")}</h4>
            </div>
            {/** 이미지 사용여부 */}
            <FormItem title={t("useImageYN")} customClassName={["top-line"]} required={true}>
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
                    imageInfo={{ imageList: formItem.section3Images, imageType: CONTENT_IMAGE_TYPE }}
                    formItem={formItem}
                    setFormItem={setFormItem}
                    setS3UploadFiles={setS3UploadFiles}
                />
            )}
        </div>
    )
}

export default Section3
