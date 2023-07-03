import React, { useCallback, useMemo, useState } from "react"
import Layer from "@/components/layout"
import { DividerIcon } from "@/components/layout/types"
import { TableTheme } from "@/utils/resources/types"
import { Button, DeleteButton } from "@/components/ui/buttons"
import { ButtonStyleType, DeleteButtonType } from "@/components/ui/buttons/types"
import { Selectbox } from "@/components/ui/forms"
import { LibraryAdd } from "@material-ui/icons"
import { useRequest } from "@/contexts/SendApiContext"
import { API, HTTP_METHOD_DELETE, HTTP_METHOD_PUT } from "@/utils/apis/request.const"
import { MENUS, MESSAGE_TYPE, T_NAMESPACE, T_PREFIX, UX_CODES, VIEW_CODES } from "@/utils/resources/constants"
import { convert2Utc } from "@/utils/common"
import { useTranslation } from "react-i18next"
import { SelectBoxItem } from "@/components/ui/forms/types"
import { PageCodeList } from "@/utils/apis/request.types"
import { useConfirm } from "@/contexts/ConfirmContext"
import { ConfirmType } from "@/components/ui/confirm/types"
import FaqAddModal from "./AddFAQModal"
import { applyPath, applyQueryString } from "@/utils/apis/request"
import Labels from "@/components/ui/labels"
import TsTable from "@/components/ui/table/TsTable"
import { CellProps, DragDrop } from "@/components/ui/table/tsTypes"
import { FAQTopProp, FAQTopProps } from "./types"
import { getLabel } from "../const"
import { AxiosError } from "axios"

const FAQManagementList = () => {
    const { useFetch, usePost, useAxios } = useRequest()
    const { setVisible, setOptions } = useConfirm()

    const { t } = useTranslation(T_NAMESPACE.MENU1, { keyPrefix: T_PREFIX.TABLE })
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)

    const [open, setOpen] = useState<boolean>(false)
    const [selectedPoc, setSelectedPoc] = useState<SelectBoxItem>()
    const [checkList, setCheckList] = useState<string[]>([])
    const [pocfaqlist, setPocFaqList] = useState<FAQTopProps>({ totalCount: 0, list: [] })

    /** POC 아이템 조회 */
    useFetch<Array<PageCodeList>>({ url: `${API.OPCODE_LIST}/${VIEW_CODES.FAQ}/list` }, {})

    /** POC별 FAQ 조회 */
    const { refetch: setList, isFetching } = usePost(selectedPoc ? { url: API.FAQ_LIST, data: { pocCd: selectedPoc.value } } : null, {
        onSuccess: (data: FAQTopProps) => setPocFaqList(data),
    })

    /** SelectBox 이벤트 */
    const onChangePoc = useCallback(
        (item: SelectBoxItem) => {
            setSelectedPoc(item)
            setCheckList([])
        },
        [selectedPoc]
    )

    /** 테이블 칼럼 */
    const columns = useMemo(
        () => [
            { id: "check", accessorKey: "check" },
            { id: "drag", header: g("sequence"), accessorKey: "drag" },
            { id: "orderNo", header: "No", accessorKey: "orderNo" },
            { id: "categoryName", header: g("category"), accessorKey: "categoryName" },
            { id: "title", header: g("title"), accessorKey: "title", isClick: true },
            { id: "readCnt", header: g("readCount"), accessorKey: "readCnt" },
            {
                id: "viewYn",
                header: g("viewYn"),
                accessorKey: "viewYn",
                cell: ({ row }: CellProps) => {
                    const { styleType, title } = getLabel(row.original.viewYn as string)
                    return <Labels styleType={styleType}>{g(title)}</Labels>
                },
            },
            {
                id: "updateDt",
                header: g("updateDateTime"),
                accessorKey: "updateDt",
                accessorFn: (row: FAQTopProp) => `${convert2Utc(row.updateDt)}(${row.updateId})`,
            },
        ],
        []
    )

    /** 새 탭 이동 */
    const onMoveTab = useCallback(
        (noId: string) => {
            window.parent.postMessage({
                id: "faq",
                viewYn: true,
                uxId: UX_CODES.FAQ,
                menuNm: t("faqList"),
                update: true,
                vdiYn: false,
                type: MESSAGE_TYPE.TAB,
                url: applyQueryString(MENUS.FAQ_DETAIL, { cd: noId }),
            })
        },
        [pocfaqlist]
    )

    /** 순서 변경 이벤트 */
    const onDrop = useCallback(
        ({ dragIdx, dropIdx }: DragDrop) => {
            setVisible(true)
            setOptions({
                type: ConfirmType.danger,
                message: g("confirm.onChangeOrder"),
                buttonStyle: ButtonStyleType.danger,
                applyButtonMessage: g("button.ok"),
                onApply: () => {
                    useAxios(
                        {
                            url: applyPath(API.FAQ_ORDER, selectedPoc.value),
                            param: {
                                id: pocfaqlist.list[dragIdx].noId,
                                newOrderNo: pocfaqlist.list[dropIdx].orderNo,
                            },
                            method: HTTP_METHOD_PUT,
                        },
                        () => setList()
                    )
                    setPocFaqList((state: FAQTopProps) => {
                        state.list.splice(dropIdx, 0, state.list.splice(dragIdx, 1)[0])
                        return { ...state, list: state.list.slice() }
                    })
                },
            })
        },
        [pocfaqlist]
    )

    /** 삭제 이벤트 */
    const onDelete = useCallback(() => {
        useAxios(
            {
                url: applyPath(API.FAQ_DETAIL, selectedPoc.value),
                method: HTTP_METHOD_DELETE,
                param: { list: checkList.map(id => ({ id })) },
            },
            () => {
                setList()
                setCheckList([])
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
    }, [checkList])

    return (
        <div id="faqManagementList">
            <p className="body-description">{t("description")}</p>
            <div className="table-top-wrap">
                <div className="table-search">
                    <Selectbox items={[]} onChange={onChangePoc} />
                </div>
                <div className="button-wrap">
                    <Button styleType={ButtonStyleType.primary} onClick={() => setOpen(true)} border={true}>
                        <LibraryAdd />
                        {g("button.add")}
                    </Button>
                    <DeleteButton type={DeleteButtonType.Button} buttonProp={{ disabled: !checkList.length, border: true }} onClick={onDelete} />
                </div>
            </div>
            <TsTable
                keyName="noId"
                theme={TableTheme.lined}
                columns={columns}
                rows={pocfaqlist.list}
                checkList={checkList}
                setCheckList={setCheckList}
                onClickHandler={onMoveTab}
                onDrop={onDrop}
                isLoading={isFetching}
                noResultMsg={g("noResult")}
            />
            {open && (
                <FaqAddModal
                    setList={setList}
                    setOpen={setOpen}
                    data={{ categoryList: [], selectedPoc, selectedFaqs: pocfaqlist.list.map(item => item.noId) }}
                />
            )}
        </div>
    )
}

export default React.memo(FAQManagementList)
