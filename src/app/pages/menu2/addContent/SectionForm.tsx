import React, { useMemo, useCallback } from "react"
import FormItem from "@/components/ui/forms/FormItem"
import Radio, { RadioProps } from "@/components/ui/forms/Radio"
import { T_NAMESPACE, T_PREFIX } from "@/utils/resources/constants"
import { useTranslation } from "react-i18next"
import { SectionFormProp, SectionDataProp, DetailSelectBoxItem, ModalSelectBoxItem } from "./types"
import { contentsSettingType } from "./const"
import SectionWrapper from "./wrapper/SectionForm"
import ContentsSchedulingForm from "./wrapper/SchedulingForm"
import "./styles.scss"

/**
 * 섹션 별 컨텐츠 추가
 * @param broadcastClass
 * @param contentsType
 * @param channelType
 * @param formItem
 * @param setFormItem
 */
const SectionForm = ({
    contentsType,
    modalItems,
    formItem,
    setFormItem,
}: {
    modalItems: ModalSelectBoxItem
    formItem: SectionFormProp
    setFormItem: React.Dispatch<React.SetStateAction<SectionFormProp>>
} & Partial<DetailSelectBoxItem>) => {
    const { t } = useTranslation(T_NAMESPACE.MENU2, { keyPrefix: T_PREFIX.CURATION })
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)

    /** 섹션 설정 아이템 */
    const usageItem = useMemo(
        (): RadioProps<string, any>[] => [
            {
                id: "section_disabled",
                title: g("label.useN"),
                value: 0,
            },
            {
                id: "section_enabled",
                title: g("label.useY"),
                value: 1,
            },
        ],
        []
    )

    /** 콘텐츠 타입 선택 */
    const onSelectContentType = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation()
            const { name, value } = e.target
            setFormItem(prev => ({
                ...prev,
                [name]: value,
                sections: [
                    {
                        open: true,
                        sectionName: "",
                        organizations: [],
                        sectionOrder: 1,
                    },
                ]
            }))
        },
        [formItem]
    )

    /** 섹션 사용여부 선택 */
    const onSelectSectionYn = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation()
            const { name, value } = e.target
            const useYn = Boolean(Number(value))
            const sections: SectionDataProp = { open: true, sectionName: "", organizations: [] }

            setFormItem(prev => ({
                ...prev,
                [name]: useYn,
                sections: [{ ...sections }],
            }))
        },
        []
    )

    /** 라디오 선택 아이템 */
    const [contentsTypeItem, useSectionItem] = useMemo(
        () => [
            contentsType.find(item => item.value == formItem.contentsType)?.id,
            usageItem.find(item => item.value == Number(formItem.sectionYn))?.id,
        ],
        [formItem]
    )

    return (
        <div className="content-area form-group-shape content-organize" id="contentOrganization">
            <div className="main-title-wrap">
                <h4>{t("sectionContents")}</h4>
            </div>
            {/** 콘텐츠 조회 */}
            <FormItem title={t("contentsType")} required={true} customClassName={["top-line"]}>
                <div className="write-top-area">
                    <p className="help">{t(contentsSettingType[formItem.contentsType].desc)}</p>
                </div>
                <Radio
                    name="contentsType"
                    list={contentsType}
                    data={contentsTypeItem}
                    onChange={onSelectContentType}
                />
            </FormItem>
            {/** 섹션 설정 */}
            <FormItem title={t("sectionUsage")}>
                <Radio
                    name="sectionYn"
                    list={usageItem}
                    data={useSectionItem}
                    onChange={onSelectSectionYn}
                />
            </FormItem>
            {/* 콘텐츠 편성 */}
            {formItem.sectionYn ? (
                <SectionWrapper selectBoxItems={modalItems} formItem={formItem} setFormItem={setFormItem}/>
            ) : (
                <ContentsSchedulingForm
                    order={0}
                    formItem={formItem}
                    setFormItem={setFormItem}
                    selectBoxItems={modalItems}
                />
            )}
        </div>
    )
}

export default SectionForm
