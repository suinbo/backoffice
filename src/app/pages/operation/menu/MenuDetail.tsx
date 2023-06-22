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
import { MenuDetailProp, MenuLangList, MenuLangProps, MenuLanguage, MenuRegion, MenuStateType, MenuUxList, MenuUxProps } from "./types"
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
import { CHECK_TWO_DEPTH, MENU_LIST_KEY } from "./const"

const defaultValue: MenuDetailProp = {
    id: "",
    orderNo: 0,
    desc: "",
    viewYn: false,
    dUxId: "",
    uxList: [
        {
            regionId: "",
            uxId: "",
        },
    ],
    defaultName: "",
    langList: [
        {
            code: "",
            name: "",
        },
    ],
}

const validator: Array<ValidatorProp> = [
    { key: "id", required: true, type: ValidatorType.text },
    { key: "orderNo", required: true, type: ValidatorType.number },
    {
        key: "uxList",
        type: ValidatorType.text,
        fn: (uxList: MenuUxList, formItem: MenuDetailProp) => {
            if (formItem.viewYn) return uxList.every((v: MenuUxProps) => v.uxId?.trim() && v.regionId?.trim()) ? null : "inValidRequired"
            return null
        },
    },
    {
        key: "dUxId",
        type: ValidatorType.text,
        fn: (dUxId: string, formItem: MenuDetailProp) => {
            if (formItem.viewYn && !dUxId.toString().trim()) return "inValidRequired"
            return null
        },
    },
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
        fn: (langList: MenuLangList, formItem: MenuDetailProp) => {
            if (formItem.langList.length) return langList.every((v: MenuLangProps) => !!v.code?.trim() && !!v.name?.trim()) ? null : "inValidRequired"
            return null
        },
    },
]

/** Menu Detail Page */
const Detail = ({ menuState, setMenuState }: { menuState: MenuStateType; setMenuState: (menuState: MenuStateType) => void }) => {
    const { t } = useTranslation(T_NAMESPACE.GLOBAL, { keyPrefix: T_PREFIX.MENU })
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
    const { t: v } = useTranslation(T_NAMESPACE.VALIDATE)
    const { useAxios, useFetch, globalMutate } = useRequest()

    /**화면 상태 변수 */
    const { menuId, depth, hasLeafs } = menuState
    const [formItem, setFormItem] = useState<MenuDetailProp>({ ...defaultValue })
    const [uxList, setUxList] = useState<SelectBoxListItem[]>([])
    const [langList, setLangList] = useState<SelectBoxListItem[]>([])

    const { isValid } = useValidate<MenuDetailProp>({ ...formItem })
    const { setVisible, setOptions } = useConfirm()

    //리전 셀렉박스 리스트 목록
    const { data: regions } = useFetch<Array<MenuRegion>>({ url: API.FAQ_LIST })

    //언어 셀렉박스 리스트 목록
    const { data: languages } = useFetch<Array<MenuLanguage>>({ url: API.FAQ_LIST })

    // 선택된 MenuId의 상세 데이터 조회
    const { data: details, refetch: setDetails, isFetching } = useFetch<MenuDetailProp>(menuId ? { url: applyPath(API.FAQ_DETAIL, menuId) } : null)

    const region = useMemo(
        () =>
            regions
                ? regions.map((item: MenuRegion) => ({
                      label: `${item.code}(${g(`region.${item.code}`)})`,
                      value: item.code,
                  }))
                : [],
        [regions]
    )
    const language = useMemo(() => {
        return languages?.map((l: MenuLanguage) => ({ label: l.name, value: l.code })) ?? []
    }, [languages])

    useEffect(() => {
        if (details) {
            setFormItem({ ...details })
            setLangList(
                details.langList.map((item: MenuLangProps) => ({
                    inputValue: item.name,
                    selectBoxItem: {
                        label: language.find((language: SelectBoxItem) => language.value === item.code)?.label,
                        value: item.code,
                    },
                    origin: true,
                }))
            )
            setUxList(
                details.uxList.map((uxItem: MenuUxProps) => ({
                    inputValue: uxItem.uxId,
                    selectBoxItem: {
                        label: region.find((region: SelectBoxItem) => region.value === uxItem.regionId)?.label,
                        value: uxItem.regionId,
                    },
                    origin: true,
                }))
            )
        }
    }, [details, region, language])

    // Change FormItem matched with own ID
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
                                globalMutate([MENU_LIST_KEY])
                                setMenuState({ viewYn: formItem.viewYn })
                                setUxList([])
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
    const onCancleClick = useCallback(() => {
        setMenuState({ nodeId: null, menuId: null })
    }, [])

    /** 현재 선택된 list가 2 depth인지 확인*/
    const isTwoDepth = useMemo(() => depth === CHECK_TWO_DEPTH, [depth])

    const viewYnChange = useCallback(() => {
        setFormItem(prev => ({
            ...prev,
            viewYn: !formItem.viewYn,
        }))
    }, [formItem.viewYn])

    /** SelectList */
    const filteredUxListRegion = useMemo(
        () => region.filter((region: SelectBoxItem) => !uxList.find(item => item.selectBoxItem.value === region.value)),
        [uxList, region]
    )
    const filteredUxMenuLang = useMemo(
        () => language.filter((language: SelectBoxItem) => !langList.find(item => item.selectBoxItem.value === language.value)),
        [langList, language]
    )

    /** 화면ID SelectBoxList setItems Function */
    const setUxListSelectBoxListItems = useCallback((nextData: SelectBoxListItem[]) => {
        const result = nextData.map(item => ({
            regionId: item.selectBoxItem.value ?? "",
            uxId: item.inputValue ?? "",
        }))
        setUxList(nextData)
        setFormItem(prev => ({ ...prev, uxList: result }))
    }, [])

    /** 메뉴명 SelectBoxList setItems Function */
    const setUxMenuSelectBoxListItems = useCallback((nextData: SelectBoxListItem[]) => {
        const result = nextData.map(item => ({
            code: item.selectBoxItem.value ?? "",
            name: item.inputValue ?? "",
        }))
        setLangList(nextData)
        setFormItem(prev => ({ ...prev, langList: result }))
    }, [])

    /** SelectBoaxList 아이템 추가  */
    const addSelectBox = useCallback(
        (list: SelectBoxListItem[], key: string) => {
            if (region.length > list.length && key === MENU_LIST.UX_LIST)
                setUxList([{ selectBoxItem: { value: "", label: "" }, inputValue: "", origin: false }, ...uxList])
            if (language.length > list.length && key === MENU_LIST.LANG_LIST)
                setLangList([{ selectBoxItem: { value: "", label: "" }, inputValue: "", origin: false }, ...langList])

            setFormItem(prev => ({
                ...prev,
                [key]:
                    key === MENU_LIST.UX_LIST
                        ? [
                              ...prev.uxList,
                              {
                                  regionId: "",
                                  uxId: "",
                              },
                          ]
                        : [...prev.langList, { code: "", name: "" }],
            }))
        },
        [uxList, langList, region, language]
    )

    /** 라디오리스트 아이템  */
    const viewYnRadioList = useMemo(
        () => [
            {
                id: "useGroup",
                title: t("useGroup"),
                value: "useGroup",
            },
            {
                id: "useScreen",
                title: t("useScreen"),
                value: "useScreen",
            },
        ],
        []
    )

    /** 상세 디테일 폼 */
    const Content = (
        <DetailForm>
            {/* 그룹/메뉴 사용 여부 라디오 */}
            {!details?.viewYn && isTwoDepth && !hasLeafs && (
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
            )}
            <FormItem isDivide={true} required={true}>
                <Label id="id" value={t("searviceId")} />
                <Input id="id" type="text" value={formItem.id} readonly={true} />
            </FormItem>
            <FormItem isDivide={true} required={true}>
                <Label id="orderNo" value={t("orderNo")} />
                <Input id="orderNo" type="text" value={formItem.orderNo} onChange={handleChange} />
            </FormItem>

            {/* 메뉴명 */}
            <FormItem customClassName={["form-add-item"]} required={true}>
                <span> {t("menuName")} </span>
                <div className="default">
                    <Label id="defaultName" value="Default" />
                    <Input type="text" id="defaultName" value={formItem.defaultName} onChange={handleChange} />
                    <LibraryAdd className="add" onClick={() => addSelectBox(langList, MENU_LIST.LANG_LIST)} />
                </div>
                <SelectBoxList
                    listItems={langList}
                    selectList={filteredUxMenuLang}
                    setlistItems={setUxMenuSelectBoxListItems}
                    emptyLabel={t("menuEmptyMsg")}
                    inputLabel={t("menuInputPlaceholder")}
                />
            </FormItem>

            <FormItem>
                <Label id="desc" value={t("description")} />
                <TextArea id="desc" value={formItem.desc} onChangeArea={handleChange} />
            </FormItem>

            {/* 화면아이디 셀렉터 박스 */}
            {!!formItem.viewYn && (
                <FormItem customClassName={["form-add-item"]} required={true}>
                    <span> {t("defaultScreenId")} </span>
                    <div className="default">
                        <Label id="dUxId" value="Default" />
                        <Input type="text" id="dUxId" value={formItem.dUxId} onChange={handleChange} />
                        <LibraryAdd className="add" onClick={() => addSelectBox(uxList, MENU_LIST.UX_LIST)} />
                    </div>
                    <SelectBoxList
                        listItems={uxList}
                        selectList={filteredUxListRegion}
                        setlistItems={setUxListSelectBoxListItems}
                        emptyLabel={t("regionEmptyMsg")}
                        inputLabel={t("screenInputPlaceholder")}
                    />
                </FormItem>
            )}
            <ButtonGroup onApply={saveFormItem} onCancel={onCancleClick} styleType={ButtonStyleType.primary} hasAuth={true}>
                {g("button.save")}
            </ButtonGroup>
        </DetailForm>
    )

    return isFetching ? <Loading /> : Content
}

export default React.memo(Detail)
