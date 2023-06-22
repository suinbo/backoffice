import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { DividerIcon } from "@/components/layout/types"
import { Button } from "@/components/ui/buttons"
import { ButtonStyleType } from "@/components/ui/buttons/types"
import { Close, LibraryAdd } from "@material-ui/icons"
import { PAGINATION_FORMAT, T_NAMESPACE, VIEW_CODES } from "@/utils/resources/constants"
import { TableTheme } from "@/utils/resources/types"
import FormItem from "@/components/ui/forms/FormItem"
import SearchForm from "@/components/ui/forms/SearchForm"
import Modal from "@/components/ui/modal"
import Layer from "@/components/layout"
import { Selectbox } from "@/components/ui/forms"
import Input from "@/components/ui/forms/Input"
import Radio from "@/components/ui/forms/Radio"
import { useRequest } from "@/contexts/SendApiContext"
import { API, HTTP_METHOD_POST } from "@/utils/apis/request.const"
import { PageCodeList } from "@/utils/apis/request.types"
import { useTranslation } from "react-i18next"
import { changeSystemCodeFormat, convert2Utc } from "@/utils/common"
import { MultiSelectBoxItem, SelectBoxItem } from "@/components/ui/forms/types"
import { useConfirm } from "@/contexts/ConfirmContext"
import { ConfirmType } from "@/components/ui/confirm/types"
import Labels from "@/components/ui/labels"
import TsTable from "@/components/ui/table/TsTable"
import { CellProps } from "@/components/ui/table/tsTypes"
import Pagination from "@/components/ui/table/Pagination"
import { FAQListProp, FAQProp, FAQRequesDataProp, FAQTopModalProp } from "./types"
import { getLabel, RADIO_LIST } from "../const"
import { AxiosError } from "axios"
import MultiSelectBox from "@/components/ui/forms/MultiSelectBox"
import { useLocation } from "react-router-dom"

const defaultValue: FAQRequesDataProp = {
    page: PAGINATION_FORMAT.DEFAULT_PAGE,
    size: PAGINATION_FORMAT.DEFAULT_LIMIT,
    search: PAGINATION_FORMAT.DEFAULT_KEYWORD,
    sType: "",
    categoryCd: [],
    pocCd: [],
    viewYn: "",
    codeId: VIEW_CODES.FAQ,
}

const FAQAddModal = ({
    setList,
    setOpen,
    data,
}: {
    setList: () => void
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    data: FAQTopModalProp
}) => {
    const { categoryList, selectedPoc, selectedFaqs } = data
    const { useFetch, usePost, useAxios } = useRequest()
    const { state } = useLocation()

    const { setVisible, setOptions } = useConfirm()
    const { t } = useTranslation(T_NAMESPACE.FAQ)
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
    const selectBoxRef = useRef<HTMLDivElement>(null)

    /** 멀티 셀렉박스 */
    const [pocSelectedItems, setPocSelectedItems] = useState<MultiSelectBoxItem[]>([])

    /** 검색조건 조회 */
    const [searchList, setSearchList] = useState<SelectBoxItem[]>([])
    useFetch<Array<PageCodeList>>(
        { url: `${API.OPCODE_LIST}/${VIEW_CODES.FAQ}/list` },
        { onSuccess: (data: Array<PageCodeList>) => setSearchList(changeSystemCodeFormat(data, "search")) }
    )

    /** 검색 요청 파람 */
    const [formItem, setFormItem] = useState<FAQRequesDataProp>({ ...defaultValue, pocCd: [selectedPoc?.value ?? ""] })
    const [reqestItem, setRequestItem] = useState<FAQRequesDataProp>(formItem)
    const [checkList, setCheckList] = useState<string[]>(selectedFaqs)

    /** 체크 해제 */
    useEffect(() => {
        const isOverFaqIds = selectedFaqs?.every(id => checkList.includes(id))
        if (!isOverFaqIds) setCheckList([...selectedFaqs.filter(item => !checkList.includes(item)), ...checkList])
    }, [checkList])

    useEffect(() => {
        if (searchList.length) {
            const sType = searchList[0].value
            const param = (state as FAQRequesDataProp) || { ...reqestItem, sType }

            setFormItem(prev => ({ ...prev, sType }))
            setRequestItem(prev => ({ ...prev, sType }))
            setPocSelectedItems(
                categoryList.map(item => ({
                    ...item,
                    isChecked: !param.categoryCd.length || !!param.categoryCd.find(code => code == item.value),
                }))
            )
        }
    }, [searchList])

    /** FAQ 리스트 조회 */
    const [faqList, setFaqList] = useState<FAQListProp>({ totalCount: 0, list: [] })
    const { isFetching } = usePost(reqestItem.sType ? { url: API.FAQ_LIST, data: { ...reqestItem } } : null, {
        onSuccess: (data: FAQListProp) => setFaqList(data),
    })

    /** Input 이벤트 */
    const onSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormItem(prev => ({ ...prev, [name]: value }))
    }, [])

    /** SelectBox 이벤트 */
    const onChange = useCallback((key: keyof FAQRequesDataProp, item: SelectBoxItem) => setFormItem(prev => ({ ...prev, [key]: item.value })), [])

    /** 검색 이벤트 */
    const onSearch = useCallback(() => setRequestItem(formItem), [formItem])

    /** 추가 이벤트 */
    const onSave = useCallback(() => {
        if (checkList.length) {
            setOptions({
                type: ConfirmType.success,
                message: g("confirm.onSave"),
                buttonStyle: ButtonStyleType.primary,
                applyButtonMessage: g("button.save"),
                onApply: () => {
                    useAxios(
                        {
                            url: `${API.FAQ_DETAIL}/${selectedPoc.value}`,
                            method: HTTP_METHOD_POST,
                            param: { list: checkList.map(id => ({ id })) },
                        },
                        () => {
                            setOptions({
                                type: ConfirmType.alert,
                                message: g("alert.onSaveSuccess"),
                                buttonStyle: ButtonStyleType.default,
                                applyButtonMessage: g("button.ok"),
                                onApply: () => {
                                    setList()
                                    setOpen(false)
                                    setCheckList([])
                                },
                            })
                            setVisible(true)
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
                message: g("alert.noChecked"),
                buttonStyle: ButtonStyleType.default,
                applyButtonMessage: g("button.ok"),
            })
            setVisible(true)
        }
    }, [checkList])

    /** 페이지 이벤트 */
    const controlPage = useCallback((page: number) => setRequestItem(prev => ({ ...prev, page })), [reqestItem])

    /** Modal Header */
    const modalHeaderRenderer = useCallback(() => {
        return (
            <>
                <h2>
                    <LibraryAdd className="modal-title-icon writing-icon" />
                    {t("addFrequentlyAskedList")}
                </h2>
                <Close className="close" onClick={() => setOpen(false)} />
            </>
        )
    }, [])

    /** Modal Footer */
    const modalFooterRenderer = useCallback(() => {
        return (
            <>
                <Button styleType={ButtonStyleType.primary} onClick={onSave}>
                    {g("button.add")}
                </Button>
                <Button styleType={ButtonStyleType.default} onClick={() => setOpen(false)}>
                    {g("button.cancel")}
                </Button>
            </>
        )
    }, [checkList])

    /** 라디오 아이템 */
    const blindItems = useMemo(() => RADIO_LIST.map(item => ({ ...item, id: `blind_${item.id}`, title: g(item.title) })), [])

    /** 멀티셀렉박스 이벤트 핸들러 */
    const onMultiSelect = useCallback((item: MultiSelectBoxItem[]) => {
        setPocSelectedItems(item)
        setFormItem(prev => ({ ...prev, categoryCd: item.filter(i => i.isChecked).map(v => v.value) }))
    }, [])

    /** 테이블 칼럼 */
    const columns = useMemo(
        () => [
            { id: "check", accessorKey: "check" },
            { id: "no", header: g("column.no"), accessorKey: "no" },
            { id: "categoryName", header: g("column.category"), accessorKey: "categoryName" },
            { id: "title", header: g("column.title"), accessorKey: "title" },
            {
                id: "pocList",
                header: g("column.viewPoc"),
                accessorKey: "pocList",
                accessorFn: (row: FAQProp) => (row.isAll ? g("label.all") : row.pocList.map((item: { name: string }) => item.name).join(", ")),
            },
            { id: "readCnt", header: g("column.readCount"), accessorKey: "readCnt" },
            {
                id: "updateDt",
                header: g("column.updateDateTime"),
                accessorKey: "updateDt",
                accessorFn: (row: FAQProp) => `${convert2Utc(row.updateDt)}(${row.updateId})`,
            },
            {
                id: "viewYn",
                header: g("column.viewYn"),
                accessorKey: "viewYn",
                cell: ({ row }: CellProps) => {
                    const { styleType, title } = getLabel(row.original.viewYn as string)
                    return <Labels styleType={styleType}>{g(title)}</Labels>
                },
            },
        ],
        []
    )

    return (
        <Modal classList={["add-modal faq-add"]} headerRenderer={modalHeaderRenderer} footerRenderer={modalFooterRenderer}>
            <div className="writing-area" ref={selectBoxRef}>
                <SearchForm title={t("frequentlyAskedList")} onSearch={onSearch}>
                    <FormItem title={g("search.condition")}>
                        <Selectbox
                            ref={selectBoxRef}
                            items={searchList}
                            defaultLabel={searchList[0]?.label}
                            onChange={item => onChange("sType", item)}
                        />
                        <Input
                            name="search"
                            type="text"
                            onChange={onSelect}
                            value={formItem.search}
                            placeholder={g("search.placeholder")}
                            onKeyUp={e => e.key === "Enter" && onSearch()}
                        />
                    </FormItem>
                    <FormItem title={g("search.category")} isDivide={true}>
                        <MultiSelectBox classList={["long-select-box"]} hasAll={true} items={pocSelectedItems} onChange={onMultiSelect} />
                    </FormItem>
                    <FormItem title={g("search.poc")} isDivide={true}>
                        <p>{selectedPoc?.label ?? ""}</p>
                    </FormItem>
                    <FormItem title={g("search.viewYn")}>
                        <Radio
                            key="viewYn"
                            name="viewYn"
                            list={blindItems}
                            data={blindItems.find(data => data.value == formItem.viewYn)?.id}
                            onChange={onSelect}
                        />
                    </FormItem>
                </SearchForm>
                <Layer.DividerHeader icon={DividerIcon.format} title={t("faqList")} />
                <div className="total-count">
                    <label>{g("totalCount", { val: faqList.totalCount })}</label>
                </div>
                <TsTable
                    keyName="noId"
                    theme={TableTheme.boxed}
                    columns={columns}
                    rows={faqList.list}
                    dimList={selectedFaqs}
                    checkList={checkList}
                    setCheckList={setCheckList}
                    isLoading={isFetching}
                />
                <Pagination offset={reqestItem.page} limit={reqestItem.size} total={faqList.totalCount} onChange={controlPage} />
            </div>
        </Modal>
    )
}

export default React.memo(FAQAddModal)
