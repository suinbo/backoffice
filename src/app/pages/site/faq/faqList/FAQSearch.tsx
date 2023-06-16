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

/** 시스템 코드 포맷 변경 */
export const getCategoryCode = (codeList: Array<PageCodeList>, code: string) => {
    const getDepth = codeList[0].leafs.find(leaf => leaf.id == code)
    return getDepth.leafs.map((item: PageCodeListProps) => ({ label: item.name, value: item.id }))
}

export const getMultiSelectedItem = (codeList: Array<PageCodeList>, code: string) => {
    const getDepth = codeList[0].leafs.find(leaf => leaf.id == code)
    return getDepth.leafs.map((item: PageCodeListProps) => ({ label: item.name, value: item.id, isChecked: true }))
}

const FAQSearch = ({ requestData, setRequestData }: FAQPageProp) => {
    const { t } = useTranslation(T_NAMESPACE.FAQ)
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)

    const { state } = useLocation()
    const { useFetch } = useRequest()
    const [formItem, setFormItem] = useState<FAQRequesDataProp>(requestData)

    /** 셀렉박스 아이템 */
    const [searchItems, setSearchItem] = useState<SelectBoxItem[]>([])
    const [ctgSeletedItems, setCtgSelectedItems] = useState<MultiSelectBoxItem[]>([])
    const [pocSelectedItems, setPocSelectedItems] = useState<MultiSelectBoxItem[]>([])

    /** 운영 코드 조회 */
    useFetch<Array<PageCodeList>>(
        { url: `${API.OPCODE_LIST}/${VIEW_CODES.FAQ}/list` },
        {
            onSuccess: (res: Array<PageCodeList>) => {
                const getSearchItem = getCategoryCode(res, "search")
                setRequestData(prev => ({ ...prev, sType: getSearchItem[0].value }))

                setSearchItem(getSearchItem)
                setCtgSelectedItems(getMultiSelectedItem(res, "category"))
                setPocSelectedItems(getMultiSelectedItem(res, "poc"))
            },
        }
    )

    /** 노출 여부 아이템 */
    const blindItems: RadioProps<NUMBER_BLINDRADIO_KEY, NUMBER_BLIND_RADIO_VALUE>[] = useMemo(
        () => RADIO_LIST.map(item => ({ ...item, title: g(item.title) })),
        []
    )

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
        setFormItem({ ...defaultRequestData, sType: searchItems[0].value })
        setPocSelectedItems(pocSelectedItems.map(item => ({ ...item, isChecked: true })))
        //setCtgSelectedItems(categoryItems.map(item => ({ ...item, isChecked: true })))
    }, [searchItems, pocSelectedItems, ctgSeletedItems])

    return (
        <SearchForm title={t("faqSearch")} onSearch={onSearch} onClear={onClear}>
            <FormItem title={g("search.condition")}>
                <Selectbox
                    items={searchItems}
                    onChange={item => setFormItem(prev => ({ ...prev, sType: item.value }))}
                    //defaultItem={sType}
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
