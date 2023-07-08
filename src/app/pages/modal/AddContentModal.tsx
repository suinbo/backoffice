import React, { useCallback, useEffect, useRef, useState } from "react"
import { DividerIcon } from "@/components/layout/types"
import { Button } from "@/components/ui/buttons"
import { ButtonStyleType } from "@/components/ui/buttons/types"
import { Close, LibraryAdd } from "@material-ui/icons"
import { PAGINATION_FORMAT, T_NAMESPACE, T_PREFIX } from "@/utils/resources/constants"
import { TableTheme } from "@/utils/resources/types"
import FormItem from "@/components/ui/forms/FormItem"
import SearchForm from "@/components/ui/forms/SearchForm"
import Modal from "@/components/ui/modal"
import Layer from "@/components/layout"
import { Selectbox } from "@/components/ui/forms"
import Input from "@/components/ui/forms/Input"
import { useRequest } from "@/contexts/SendApiContext"
import { useTranslation } from "react-i18next"
import { applyQueryString } from "@/utils/apis/request"
import { API } from "@/utils/apis/request.const"
import { SelectBoxItem } from "@/components/ui/forms/types"
import { useConfirm } from "@/contexts/ConfirmContext"
import { ConfirmType } from "@/components/ui/confirm/types"
import TsTable from "@/components/ui/table/TsTable"
import { EpisodeAddModalProps, ContentModalRequestProps, ContentsListProp, ContentsList } from "../menu2/addContent/types"
import { defaultEpisodeRequestData } from "../menu2/addContent/const"
import Pagination from "@/components/ui/table/Pagination"
import { getComma } from "@/utils/common"
import "./styles.scss"

/**
 *
 * @param onClose 모달 닫기
 * @param item 저장된 아이템 (dimmed item)
 * @param setItem 추가 아이템 저장
 * @param isRadio 라디오 유무
 * @param customItems 커스텀 아이템(컬럼, 셀렉박스)
 * @param langPack
 */
const AddContentModal = ({ onClose, item, setItem, customItems }: EpisodeAddModalProps) => {
    const { t } = useTranslation(T_NAMESPACE.MENU2)
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
    const { useFetch } = useRequest()
    const { setOptions, setVisible } = useConfirm()
    const modalRef = useRef(null)

    const {
        columns,
        selectBoxItems,
    } = customItems

    /** 콘텐츠 조회 요청파람 */
    const [requestData, setRequestData] = useState<ContentModalRequestProps>(defaultEpisodeRequestData)
    const [formItem, setFormItem] = useState<ContentModalRequestProps>({ ...requestData })
    const [list, setList] = useState<ContentsListProp>({ totalCount: 0, list: [] })

    /** 에피소드 조회 */
    const { isFetching } = useFetch<ContentsListProp>(
        requestData.type ? Object.assign({ url: applyQueryString(API.CONTENTS_LIST, { ...requestData, type: selectBoxItems[0].value }) }) : null,
        {
            onSuccess: (res: ContentsListProp) => setList(res),
        }
    )

    const [checklist, setChecklist] = useState<Array<string>>(item)
    const [addItem, setAddItem] = useState<Array<ContentsList>>([])

    /** 체크아이템 데이터 세팅 */
    useEffect(() => {
        const compareIds = (a: string[], b: string[]) => !a.every(id => b.includes(id))
        const idsArr = (list: ContentsList[]) => list.map(item => item.pgCd)

        // dim 항목 체크 해제 방지
        if (compareIds(item, checklist)) {
            setChecklist(prev => [...prev.filter(id => item.includes(id)), ...item])
        }

        // 체크
        const addItems = checklist.filter(c => !item.includes(c))
        if (addItems.length) {
            const addList = list.list.filter(i => addItems.includes(i.pgCd) && !idsArr(addItem).includes(i.pgCd))
            setAddItem(prev => [...prev, ...addList])
        }

        // 체크 해제
        if (compareIds(idsArr(addItem), checklist)) {
            setAddItem(prev => prev.filter(item => checklist.includes(item.pgCd)))
        }
    }, [checklist])

    /** header */
    const modalHeaderRenderer = useCallback(() => {
        return (
            <>
                <h2>
                    <LibraryAdd className="modal-title-icon writing-icon" />
                    {t("addContents")}
                </h2>
                <Close
                    className="close"
                    onClick={() => {
                        onClose()
                    }}
                />
            </>
        )
    }, [])

    /** footer */
    const modalFooterRenderer = useCallback(() => {
        return (
            <>
                <Button styleType={ButtonStyleType.primary} onClick={onAdd}>
                    {g("button.add")}
                </Button>
                <Button
                    styleType={ButtonStyleType.default}
                    onClick={() => {
                        onClose()
                    }}>
                    {g("button.cancel")}
                </Button>
            </>
        )
    }, [checklist, addItem])

    /** 검색어 입력 */
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setFormItem(prev => ({ ...prev, keywords: value }))
    }, [])

    /** 페이지 이동*/
    const controllPage = useCallback(
        (pageNo: number) => {
            setFormItem(prev => ({ ...prev, pageNo }))
            setRequestData(prev => ({ ...prev, pageNo }))
        },
        [formItem]
    )

    /** 검색 */
    const onButtonClick = useCallback(() => {
        setFormItem(prev => ({ ...prev, pageNo: PAGINATION_FORMAT.DEFAULT_PAGE }))
        setRequestData({ ...formItem, type: formItem.type || selectBoxItems[0].value, pageNo: PAGINATION_FORMAT.DEFAULT_PAGE })
    }, [formItem])

    /** selectbox change */
    const onSelectBoxChange = useCallback((item: SelectBoxItem, key: string) => {
        setFormItem(prev => ({ ...prev, [key]: item.value }))
    }, [])

    /** 추가 */
    const onAdd = useCallback(() => {
        if (item.filter(Boolean).length + addItem.length < 1) {
            setVisible(true)
            setOptions({
                type: ConfirmType.alert,
                message: t("noAddItemMsg"),
                buttonStyle: ButtonStyleType.default,
                applyButtonMessage: g("button.ok"),
            })
        } else {
            addItem.length >= 1 && setItem(addItem)
            onClose()
        }
    }, [addItem, item])

    return (
        <Modal classList={["add-modal content-add"]} headerRenderer={modalHeaderRenderer} footerRenderer={modalFooterRenderer}>
            <div className="writing-area" ref={modalRef}>
                <SearchForm title={t("contentSearch")} onSearch={onButtonClick}>
                    <FormItem title={g("condition")}>
                        <Selectbox items={selectBoxItems} onChange={item => onSelectBoxChange(item, "type")} ref={modalRef} />
                        <Input
                            id="keywords"
                            type="text"
                            onChange={e => handleChange(e)}
                            value={formItem.keywords}
                            placeholder={g("placeholder")}
                            onKeyUp={e => e.key === "Enter" && onButtonClick()}
                        />
                    </FormItem>
                </SearchForm>
                <Layer.DividerHeader icon={DividerIcon.format} title={t("contentList")} />
                <div className="total-count">
                    <label>{g("totalCount", { val: getComma(list.totalCount) })}</label>
                </div>
                <div className="table-scroll">
                    <TsTable
                        keyName="pgCd"
                        theme={TableTheme.boxed}
                        rows={list.list}
                        columns={columns}
                        checkList={checklist}
                        setCheckList={setChecklist}
                        dimList={item}
                        isLoading={isFetching}
                    />
                    <Pagination offset={formItem.pageNo} limit={formItem.pageSize} total={list.totalCount} onChange={controllPage} />
                </div>
            </div>
        </Modal>
    )
}

export default React.memo(AddContentModal)
