import React, { useCallback, useMemo, useState } from "react"
import { Button } from "@/components/ui/buttons"
import FormItem from "@/components/ui/forms/FormItem"
import Input from "@/components/ui/forms/Input"
import { T_NAMESPACE, T_PREFIX } from "@/utils/resources/constants"
import { useTranslation } from "react-i18next"
import { SectionFormProp, SectionDataProp, ModalSelectBoxItem } from "../types"
import { ButtonStyleType } from "@/components/ui/buttons/types"
import { Selectbox } from "@/components/ui/forms"
import { SECTION_DEFAULT_COUNT } from "../const"
import { SelectBoxItem } from "@/components/ui/forms/types"
import ContentsSchedulingForm from "./SchedulingForm"
import cx from "classnames"
import { useConfirm } from "@/contexts/ConfirmContext"
import { ConfirmType } from "@/components/ui/confirm/types"
import { useToolTip } from "@/contexts/ToolTipContext"

/**
 * 콘텐츠 편성 > 섹션 영역
 */
const SectionWrapper = ({
    selectBoxItems,
    formItem,
    setFormItem,
}: {
    selectBoxItems: ModalSelectBoxItem
    formItem: SectionFormProp
    setFormItem: React.Dispatch<React.SetStateAction<SectionFormProp>>
}) => {
    const { t } = useTranslation(T_NAMESPACE.MENU2, { keyPrefix: T_PREFIX.CURATION })
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
    const { setVisible, setOptions } = useConfirm()
    const { tooltipHandler, setOnMouse } = useToolTip()

    const [isReOrdering, setReOrdering] = useState<boolean>(false)

    /** 셀렉박스 아이템 */
    const sectionSelectBoxItems = useMemo(
        () => formItem.sections.map((_, idx) => ({ label: t("sectionCount", { val: idx + 1 }), value: String(idx) })),
        [formItem]
    )

    /** 섹션명 입력 */
    const onTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, order: number) => {
        e.stopPropagation()
        setFormItem(prev => {
            prev.sections[order].sectionName = e.target.value
            return { ...prev, sections: [ ...prev.sections ]}
        })
    }, [])

    /** 섹션 순서 변경 */
    const onOrderSection = useCallback((currentOrder: number, selectedItem: SelectBoxItem) => {
        setReOrdering(true)
        setFormItem(prev => {
            const prevSection = prev.sections[currentOrder]
            prev.sections[currentOrder] = prev.sections[Number(selectedItem.value)]
            prev.sections[Number(selectedItem.value)] = prevSection
            return { ...prev, sections: [ ...prev.sections ]}
        })
    }, [])

    /** 섹션 열기/닫기 */
    const onOpen = useCallback((order: number) => {
        setFormItem(prev => {
            prev.sections[order].open = !prev.sections[order].open
            return { ...prev, sections: [ ...prev.sections ]}
        })
    }, [])

    /** 섹션 삭제 */
    const onDeleteSection = useCallback((e: React.MouseEvent<HTMLButtonElement>, order: number) => {
        e.stopPropagation()
        setOptions({
            type: ConfirmType.alert,
            message: g("confirm.onDeleteSection", { val: order + 1 }),
            buttonStyle: ButtonStyleType.default,
            applyButtonMessage: g("button.ok"),
            onApply: () => {
                setFormItem(prev => ({ ...prev, sections: prev.sections.filter((_, index) => index !== order) }))
            },
        })
        setVisible(true)
    }, [])

    /** 섹션 영역 */
    const sectionRenderer = useCallback(
        (section: SectionDataProp, order: number) => {
            const isDeleteBtn = formItem.sections.length > SECTION_DEFAULT_COUNT
            return (
                <div
                    key={order}
                    className={cx("section-area", { "red-line": !section.sectionName || !section.organizations.length }, { fold: !section.open })}>
                    <div
                        className="section-title"
                        onClick={() => {
                            setOnMouse(false)
                            onOpen(order)
                        }}>
                        <div className={cx("section-name", { btn: isDeleteBtn })}>
                            <Selectbox
                                items={sectionSelectBoxItems}
                                onChange={item => onOrderSection(order, item)}
                                defaultItem={sectionSelectBoxItems.find(item => item.value == String(order))}
                            />
                            {!section.open && (
                                <p onMouseEnter={e => tooltipHandler(e, true, section.sectionName)} onMouseLeave={() => setOnMouse(false)}>
                                    {section.sectionName}
                                </p>
                            )}
                        </div>
                        <div className="section-etc">
                            {isDeleteBtn && (
                                <Button
                                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                        e.stopPropagation()
                                        onDeleteSection(e, order)
                                    }}
                                    styleType={ButtonStyleType.danger}
                                    border={true}>
                                    {t("deleteSection")}
                                </Button>
                            )}
                        </div>
                    </div>
                    <FormItem title={t("sectionName")} required={true}>
                        <Input name="title" type="text" onChange={e => onTextChange(e, order)} value={section.sectionName} />
                    </FormItem>
                    {/* 콘텐츠 편성 */}
                    <ContentsSchedulingForm
                        order={order}
                        formItem={formItem}
                        setFormItem={setFormItem}
                        selectBoxItems={selectBoxItems}
                        isReOrdering={isReOrdering}
                        setReOrdering={setReOrdering}
                    />
                </div>
            )
        },
        [formItem, selectBoxItems]
    )

    /** 섹션 추가 */
    const onSectionAdd = useCallback(() => {
        setFormItem(prev => ({
            ...prev, 
            sections: [
                ...prev.sections,
                {
                    open: true,
                    sectionName: "",
                    organizations: [],
                },
            ]
        }))
    }, [formItem])

    return (
        <>
            {formItem.sections.map((section: SectionDataProp, idx: number) => sectionRenderer(section, idx))}
            <div className="button-group">
                <Button onClick={onSectionAdd} styleType={ButtonStyleType.primary} border={true}>
                    {t("addSection")}
                </Button>
            </div>
        </>
    )
}

export default React.memo(SectionWrapper)
