import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { VIEW_CODES, PAGINATION_FORMAT, T_NAMESPACE, UX_CODES } from "@/utils/resources/constants"
import { Selectbox } from "@/components/ui/forms"
import { MultiSelectBoxItem, SelectBoxItem } from "@/components/ui/forms/types"
import Radio, { RadioProps } from "@/components/ui/forms/Radio"
import SearchForm from "@/components/ui/forms/SearchForm"
import FormItem from "@/components/ui/forms/FormItem"
import Input from "@/components/ui/forms/Input"
import { FAQRequesDataProp, FAQPageProp } from "./types"
import MultiSelectBox from "@/components/ui/forms/MultiSelectBox"
import { useLocation } from "react-router-dom"
import { PageCodeDetailProps, PageCodeList, PageCodeListProps } from "@/utils/apis/request.types"
import { API } from "@/utils/apis/request.const"
import { useRequest } from "@/contexts/SendApiContext"
import { defaultRequestData, getLabel, RADIO_LIST } from "./const"

//TODO 타입정리
export const NUMBER_BLIND = {
    all: "",
    enabled: 1,
    disabled: 0,
    reserved: 2,
} as const

export type NUMBER_BLINDRADIO_KEY = keyof typeof NUMBER_BLIND
export type NUMBER_BLIND_RADIO_VALUE = (typeof NUMBER_BLIND)[keyof typeof NUMBER_BLIND]

export type pocRenderCodeProps = {
    id: string
    items?: Array<string>
    name?: string
}

/** Category Code List 데이터 변형 */
export const getCategoryCode = (codeList: Array<PageCodeList>) => {
    const getCode = codeList[0].leafs
    return getCode.map((data: PageCodeList) => {
        const getLeafs = data.leafs.map((item: PageCodeListProps) => ({ label: item.name, value: item.id }))
        return {
            id: data.id,
            items: [...getLeafs],
        }
    })
}

/** Cateogry Code 셀렉박스 Items 조회 */
export const getCodeItems = (items: Array<PageCodeDetailProps>, codeType: string) => {
    return items ? items.filter(item => item.id === codeType).map(data => data.items)[0] : []
}

const FAQSearch = ({ requestData, setRequestData }: FAQPageProp) => {
    const { t } = useTranslation(T_NAMESPACE.FAQ)
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)

    const { state } = useLocation()
    const { useFetch } = useRequest()
    const [formItem, setFormItem] = useState<FAQRequesDataProp>(requestData)

    /** 멀티 셀렉박스 */
    const [ctgSeletedItems, setCtgSelectedItems] = useState<MultiSelectBoxItem[]>([])
    const [pocSelectedItems, setPocSelectedItems] = useState<MultiSelectBoxItem[]>([])

    /** 검색 조건 코드 조회 */
    const { data: code } = useFetch<Array<PageCodeList>>({ url: `${API.OPCODE_LIST}/${VIEW_CODES.FAQ}/list` })
    const { data: pocCode } = useFetch<Array<pocRenderCodeProps>>({ url: `${API.OPCODE_LIST}/${VIEW_CODES.POC}/${UX_CODES.FAQ}` })
    const { data: searchCode } = useFetch<Array<PageCodeList>>({ url: `${API.SYSCODE_LIST}/${UX_CODES.FAQ}/list` })

    const categoryItems = useMemo(() => code && getCodeItems(getCategoryCode(code), "category"), [code])
    const pocItems = useMemo(() => (pocCode ? pocCode.map(item => ({ label: item.name, value: item.id })) : []), [pocCode])
    const sTypeItems = useMemo(() => (searchCode ? getCodeItems(getCategoryCode(searchCode), "search") : []), [searchCode])

    const sType = useMemo(() => sTypeItems.find(item => item.value === formItem.sType) || sTypeItems[0], [formItem])

    useEffect(() => {
        if (code && pocCode && searchCode) {
            const param = (state as FAQRequesDataProp) || { ...requestData, sType: sTypeItems[0].value }

            setRequestData(param)
            setFormItem(param)

            setPocSelectedItems(setBoxItems(pocItems, "pocCd"))
            setCtgSelectedItems(setBoxItems(categoryItems, "categoryCd"))
        }
    }, [code, pocCode, searchCode])

    /** 노출 여부 아이템 */
    const blindItems: RadioProps<NUMBER_BLINDRADIO_KEY, NUMBER_BLIND_RADIO_VALUE>[] = useMemo(
        () => RADIO_LIST.map(item => ({ ...item, title: g(item.title) })),
        []
    )

    const setBoxItems = (items: SelectBoxItem[], key: keyof FAQRequesDataProp) => {
        const param = (state as FAQRequesDataProp) || { ...requestData, sType: sTypeItems[0].value }
        return items.map(item => {
            const nodsIds = param[key] as Array<string>
            return { ...item, isChecked: !nodsIds.length || !!nodsIds.find(code => code == item.value) }
        })
    }

    /** 이벤트 핸들러 */
    const onChange = useCallback((key: string, e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation()
        setFormItem(prev => ({ ...prev, [key]: e.target.value }))
    }, [])

    const onMultiSelect = useCallback((key: keyof FAQRequesDataProp, item: MultiSelectBoxItem[]) => {
        const isPoc = key === "pocCd"
        isPoc ? setPocSelectedItems(item) : setCtgSelectedItems(item)
        setFormItem(prev => ({ ...prev, [key]: item.filter(i => i.isChecked).map(v => v.value) }))
    }, [])

    /** 검색 */
    const onSearch = useCallback(() => {
        const param = {
            ...formItem,
            search: formItem.search.trim(),
            page: PAGINATION_FORMAT.DEFAULT_PAGE,
        }
        setRequestData(param)
        setFormItem(param)
        setPocSelectedItems(prev => (formItem.pocCd.length ? prev : prev.map(poc => ({ ...poc, isChecked: true }))))
        setCtgSelectedItems(prev => (formItem.categoryCd.length ? prev : prev.map(poc => ({ ...poc, isChecked: true }))))
    }, [formItem])

    const onClear = useCallback(() => {
        setFormItem({ ...defaultRequestData, sType: sTypeItems[0].value })
        setPocSelectedItems(pocItems.map(item => ({ ...item, isChecked: true })))
        setCtgSelectedItems(categoryItems.map(item => ({ ...item, isChecked: true })))
    }, [sTypeItems, pocItems, categoryItems])

    return (
        <SearchForm title={t("faqSearch")} onSearch={onSearch} onClear={onClear}>
            <FormItem title={g("search.condition")}>
                <Selectbox
                    items={sTypeItems}
                    onChange={item => setFormItem(prev => ({ ...prev, sType: item.value }))}
                    defaultItem={sType}
                    //condition={true}
                />
                <Input
                    id="search"
                    type="text"
                    onChange={e => onChange("search", e)}
                    value={formItem.search}
                    placeholder={g("search.placeholder")}
                    onKeyUp={e => e.key === "Enter" && onSearch()}
                />
            </FormItem>
            <FormItem title={g("search.category")} isDivide={true}>
                <MultiSelectBox
                    classList={["long-select-box"]}
                    hasAll={true}
                    items={ctgSeletedItems}
                    onChange={item => onMultiSelect("categoryCd", item)}
                />
            </FormItem>
            <FormItem title={g("search.poc")} isDivide={true}>
                <MultiSelectBox
                    classList={["long-select-box"]}
                    hasAll={true}
                    items={pocSelectedItems}
                    onChange={item => onMultiSelect("pocCd", item)}
                />
            </FormItem>
            <FormItem title={g("search.viewYn")}>
                <Radio
                    key="faqSearchScreenYn"
                    name="faqSearchScreenYn"
                    list={blindItems}
                    data={getLabel(formItem.viewYn)?.id}
                    onChange={e => onChange("viewYn", e)}
                />
            </FormItem>
        </SearchForm>
    )
}

export default React.memo(FAQSearch)
