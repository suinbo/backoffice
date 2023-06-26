import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { SelectBoxItem, SelectBoxListItem } from "@/components/ui/forms/types"
import { LibraryAdd } from "@material-ui/icons"
import { MENU_LIST, T_NAMESPACE, T_PREFIX } from "@/utils/resources/constants"
import { useValidate } from "@/hooks/useValidate"
import { ValidatorProp, ValidatorType } from "@/utils/resources/validators"
import { useConfirm } from "@/contexts/ConfirmContext"
import { ConfirmType } from "@/components/ui/confirm/types"
import { ButtonStyleType } from "@/components/ui/buttons/types"
import { MenuDetailProp, Menulanguage, MenuStateType } from "./types"
import { API, HTTP_METHOD_PUT } from "@/utils/apis/request.const"
import { useRequest } from "@/contexts/SendApiContext"
import { applyPath } from "@/utils/apis/request"
import SelectBoxList from "@/components/ui/forms/SelectBoxList"
import Loading from "@/components/ui/spinner"
import FormItem from "@/components/ui/forms/FormItem"
import Label from "@/components/ui/forms/Label"
import Radio from "@/components/ui/forms/Radio"
import DetailForm from "@/components/ui/forms/DetailForm"
import Input from "@/components/ui/forms/Input"
import TextArea from "@/components/ui/forms/TextArea"
import ButtonGroup from "@/components/ui/forms/ButtonGroup"
import { AxiosError } from "axios"

const defaultValue: MenuDetailProp = {
    id: "",
    orderNo: 0,
    desc: "",
    viewYn: false,
    menuNm: "",
    langList: [
        {
            rdx: 0,
            regionCd: "",
            regionNm: "",
            languageNm: ""
        },
    ],
}

const validator: Array<ValidatorProp> = [
    { key: "id", required: true, type: ValidatorType.text },
    { key: "orderNo", required: true, type: ValidatorType.number },
    {
        key: "defaultName",
        type: ValidatorType.text,
        fn: (defaultName: string) => {
            if (!defaultName.toString().trim()) return "inValidRequired"
            return null
        },
    },
    {
        key: "langList",
        type: ValidatorType.text,
        fn: (langList: Menulanguage[], formItem: MenuDetailProp) => {
            if (formItem.langList.length) return langList.every((v: Menulanguage) => !!v.languageNm?.trim()) ? null : "inValidRequired"
            return null
        },
    },
]

/** Menu Detail Page */
const Detail = ({ menuState, setMenuState }: { menuState: MenuStateType; setMenuState: (menuState: MenuStateType) => void }) => {
    const { t } = useTranslation(T_NAMESPACE.MENU1, { keyPrefix: T_PREFIX.TREE })
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
    const { t: v } = useTranslation(T_NAMESPACE.VALIDATE)
    const { useAxios, useFetch, globalMutate } = useRequest()

    /**화면 상태 변수 */
    const { menuId, depth, hasLeafs } = menuState
    const [formItem, setFormItem] = useState<MenuDetailProp>({ ...defaultValue })
    const { isValid } = useValidate<MenuDetailProp>({ ...formItem })
    const { setVisible, setOptions } = useConfirm()

    // 리전 셀렉박스 리스트 목록
    const [regionList, setRegionList]  = useState<SelectBoxItem[]>([])
    useFetch<Array<Menulanguage>>({ url: API.REGION_LIST }, {
        onSuccess: (res: Array<Menulanguage>) => 
        setRegionList(res.map(item => ({ label: item.regionNm, value: item.regionCd })))
    })

    // 선택된 메뉴 상세 조회
    const [langList, setLangList] = useState<SelectBoxListItem[]>([])
    const { data: details, refetch: setDetails, isFetching } = useFetch<MenuDetailProp>(menuId ? { url: `${API.MENU_DETAILS}?menuId=${menuId}` } : null, {
        onSuccess: (res: MenuDetailProp) => setFormItem(res)
    })

    useEffect(() => {
        details && regionList.length && setLangList(details.langList.map(language => ({ 
            inputValue: language.languageNm,
            selectBoxItem: regionList.find(region => region.value == language.regionCd),
            origin: language.languageNm == details.menuNm
        })))
    },[details, regionList])

    // Input/Textarea 이벤트 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => {
        e.stopPropagation()
        const { id, value } = e.target
        setFormItem((prev: MenuDetailProp) => ({ ...prev, [id]: value }))
    }

    /** 변경사항 저장 */
    const saveFormItem = useCallback(() => {
        isValid(validator, (valid, errors) => {
            if (valid) {
                setOptions({
                    type: ConfirmType.success,
                    message: g("confirm.onSave"),
                    buttonStyle: ButtonStyleType.primary,
                    applyButtonMessage: g("button.save"),
                    onApply: () => {
                        useAxios(
                            {
                                url: applyPath(API.FAQ_DETAIL, formItem.id),
                                param: { ...formItem },
                                method: HTTP_METHOD_PUT,
                            },
                            () => {
                                setDetails()
                                setMenuState({ viewYn: formItem.viewYn })
                            },
                            (err: AxiosError) => {
                                setOptions({
                                    type: ConfirmType.alert,
                                    message: err.message,
                                    buttonStyle: ButtonStyleType.default,
                                    applyButtonMessage: g("button.ok"),
                                })
                                setVisible(true)
                            }
                        )
                    },
                })
                setVisible(true)
            } else {
                setOptions({
                    type: ConfirmType.alert,
                    message: v(`menu.${errors[0].key}`, { val: v(errors[0].message) }),
                    buttonStyle: ButtonStyleType.default,
                    applyButtonMessage: g("button.ok"),
                })
                setVisible(true)
            }
        })
    }, [formItem, depth])

    /** 취소 버튼 이벤트 */
    const onCancleClick = useCallback(() => 
        setMenuState({ nodeId: null, menuId: null })
    , [])

    const viewYnChange = useCallback(() => {
        setFormItem(prev => ({
            ...prev,
            viewYn: !formItem.viewYn,
        }))
    }, [formItem.viewYn])

    /** 언어 셀렉박스 리스트 삭제 */
    const removeSelectBoxList = useCallback((nextData: SelectBoxListItem[]) => {
        setLangList(nextData)

        // TODO:: nextData 에 있는 항목 제외한 데이터
        const addCodeArrays = nextData.map(data => data.selectBoxItem.value)
        setRegionList(prev => prev.filter(region => 
            !addCodeArrays.includes(region.value) 
        ))
    }, [langList])

    /** SelectBoaxList 아이템 추가  */
    const addSelectBox = useCallback(
        (list: SelectBoxListItem[]) => {
            setLangList(list)
        },
        [langList]
    )

    /** 라디오 리스트 아이템  */
    const viewYnRadioList = useMemo(
        () => [
            {
                id: "useGroup",
                title: g("label.viewY"),
                value: "useGroup",
            },
            {
                id: "useScreen",
                title: g("label.viewN"),
                value: "useScreen",
            },
        ],
        []
    )

    /** 상세 폼 */
    const Content = (
        <DetailForm>
            <FormItem>
                <Label id="groupYnRadio" value={t("useGroup")} />
                <Radio
                    key="groupYn"
                    name="groupYn"
                    list={viewYnRadioList}
                    data={formItem.viewYn ? "useScreen" : "useGroup"}
                    onChange={viewYnChange}
                />
            </FormItem>
            <FormItem isDivide={true} required={true}>
                <Label id="id" value={t("systemId")} />
                <Input id="id" type="text" value={formItem.id} readonly={true} />
            </FormItem>
            <FormItem isDivide={true} required={true}>
                <Label id="orderNo" value={g("orderNo")} />
                <Input id="orderNo" type="text" value={formItem.orderNo} onChange={handleChange} />
            </FormItem>

            {/* 국가별 메뉴명 */}
            <FormItem customClassName={["form-add-item"]} required={true}>
                <span> {t("menuName")} </span>
                <div className="default">
                    <Label id="menuNm" value="Default" />
                    <Input type="text" id="menuNm" value={formItem.menuNm} onChange={handleChange} />
                    <LibraryAdd className="add" onClick={() => addSelectBox(langList)} />
                </div>
                <SelectBoxList
                    listItems={langList}
                    selectList={regionList}
                    setlistItems={removeSelectBoxList}
                    emptyLabel={t("menuEmptyMsg")}
                    inputLabel={t("menuInputPlaceholder")}
                />
            </FormItem>

            <FormItem>
                <Label id="desc" value={t("description")} />
                <TextArea id="desc" value={formItem.desc} onChangeArea={handleChange} />
            </FormItem>
            <ButtonGroup onApply={saveFormItem} onCancel={onCancleClick} styleType={ButtonStyleType.primary} hasAuth={true}>
                {g("button.save")}
            </ButtonGroup>
        </DetailForm>
    )

    return isFetching ? <Loading /> : Content
}

export default React.memo(Detail)
