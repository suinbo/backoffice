import React, { useCallback, useState, useMemo, useEffect } from "react"
import FormItem from "@/components/ui/forms/FormItem"
import Radio from "@/components/ui/forms/Radio"
import { T_NAMESPACE } from "@/utils/resources/constants"
import { useTranslation } from "react-i18next"
import { CheckItemBySelectBox, MultiSelectBoxItem } from "@/components/ui/forms/types"
import SelectCheckBox from "@/components/ui/forms/SelectCheckBox"
import { HORIZONTAL, VERTICAL } from "../const"
import { S3UploadFile } from "@/utils/aws/types"
import POCImageForm from "../wrapper/Section1ImageForm"
import { SectionImageProp, SystemCodeItemProp } from "../types"
import "../styles.scss"

/**
 * 섹션 1 
 */
const Section1 = ({
    imageType,
    contentsType,
    formItem,
    setFormItem,
    setS3UploadFiles,
}: {
    formItem: SectionImageProp
    setFormItem: React.Dispatch<React.SetStateAction<SectionImageProp>>
    setS3UploadFiles: React.Dispatch<React.SetStateAction<Array<S3UploadFile>>>
} & Partial<SystemCodeItemProp>) => {
    const { t } = useTranslation(T_NAMESPACE.MENU2)
    const [selectedPoc, setSelectedPoc] = useState<Array<CheckItemBySelectBox>>([])

    useEffect(() => setSelectedPoc(imageType.map(item => ({ ...item, isChecked: formItem.imageType.includes(item.value) }))), [imageType, formItem])

    /** 큐레이션 명, 분류 입력 */
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation()
            const { name, value } = e.target

            //설정항목 초기화
            setFormItem(prev => ({
                ...prev,
                [name]: value,
            }))
        },
        [formItem]
    )

    /** 설정 POC 선택 */
    const onChangePOC = useCallback(
        (items: MultiSelectBoxItem[]) => {
            const selectedPocs = items.filter(item => item.isChecked).map(item => item.value)

            // 이미지 타입 선택 여부
            const isVerticalImage = selectedPocs.includes("APP")
            const isHorizonImage = selectedPocs.includes("APP") || selectedPocs.includes("WEB") || selectedPocs.includes("TV")

            setSelectedPoc(items)

            // POC 별 노출 이미지 초기화
            setFormItem(prev => {
                const result = {
                    ...prev,
                    imageType: items.filter(item => item.isChecked).map(item => item.value),
                    section1Images: prev.section1Images?.filter(item =>
                        (!selectedPocs.includes("APP") && selectedPocs.includes("WEB") ? ["APP", ...selectedPocs] : selectedPocs).includes(item.pocType)
                    ),
                }

                setS3UploadFiles(prev => [
                    ...prev,
                    ...prev.filter(image => (isVerticalImage && image.option == VERTICAL) || (isHorizonImage && image.option == HORIZONTAL)),
                ])

                return result
            })
        },
        [formItem]
    )

    /** 라디오 선택 아이템 */
    const selectedCurationType = useMemo(
        () => contentsType.find(item => item.value == formItem.contentsType)?.id,
        [formItem, contentsType]
    )

    return (
        <div id="section1" className="content-area form-group-shape">
            <div className="main-title-wrap">
                <h4>{t("section1")}</h4>
            </div>
            {/** 체크박스 그룹 */}
            <FormItem title={t("imageType")} required={true} customClassName={["top-line"]}>
                <SelectCheckBox items={selectedPoc} onChange={onChangePOC} useAllCheckbox={true} />
            </FormItem>
            {/** 라디오 */}
            <FormItem title={t("contentsType")} required={true}>
                <Radio key="contentsType" name="contentsType" list={contentsType} data={selectedCurationType} onChange={handleChange} />
            </FormItem>
            {/** 이미지 첨부 영역 */}
            <POCImageForm
                imageInfo={{ imageList: formItem.section1Images, imageType: "pocType" }}
                formItem={formItem}
                setFormItem={setFormItem}
                setS3UploadFiles={setS3UploadFiles}
            />
        </div>
    )
}

export default Section1
