import React, { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ASC, DATE_FORMAT_LINE, DESC, MENUS, PAGINATION_FORMAT, T_NAMESPACE } from "@/utils/resources/constants"
import { DividerIcon } from "@/components/layout/types"
import { TableTheme } from "@/utils/resources/types"
import { ButtonStyleType } from "@/components/ui/buttons/types"
import { Button } from "@/components/ui/buttons"
import { combineUrls, convert2Utc, getComma } from "@/utils/common"
import { useNavigate } from "react-router-dom"
import Pagination from "@/components/ui/table/Pagination"
import Layer from "@/components/layout"
import Labels from "@/components/ui/labels"
import { API } from "@/utils/apis/request.const"
import { useRequest } from "@/contexts/SendApiContext"
import TsTable from "@/components/ui/table/TsTable"
import { FAQList as FAQListType, FAQListTypes, FAQPageProp } from "./types"
import { CellProps } from "@/components/ui/table/tsTypes"
import { getLabel } from "./const"

//TODO
const checkedSorting = (orderType: string, order: string, keyName: string) => {
    if (keyName === orderType) {
        return order === ASC ? "ascending-order" : "descending-order"
    } else return ""
}

const FAQList = ({ requestData, setRequestData }: FAQPageProp) => {
    const navigate = useNavigate()

    const { t } = useTranslation(T_NAMESPACE.FAQ)
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
    const { usePost } = useRequest()

    /** FAQ 리스트 조회 */
    const [faqList, setFaqList] = useState<FAQListTypes>({ totalCount: 0, list: [] })
    const { refetch: setList, isFetching } = usePost(requestData.sType ? { url: API.FAQ_LIST, data: { ...requestData } } : null, {
        onSuccess: (res: FAQListTypes) => setFaqList(res),
    })

    /** 상세 이동 */
    const showDetail = useCallback((noId?: string) => navigate(combineUrls([MENUS.FAQ_DETAIL, noId]), { state: requestData }), [requestData])
    /** 페이지네이션 오프셋 세팅 */
    const controlPage = useCallback((page: number) => setRequestData(prev => ({ ...prev, page: page })), [])

    /** 컬럼 정렬 */
    const onChangeOrder = useCallback((type: string) => {
        setRequestData(prev => ({
            ...prev,
            orderType: type,
            order: prev.orderType !== type ? DESC : prev.order === DESC ? ASC : DESC,
            page: PAGINATION_FORMAT.DEFAULT_PAGE,
        }))
    }, [])

    const tsColumns = useMemo(
        () => [
            {
                id: "no",
                accessorKey: "no",
                header: () => (
                    <div className="headerSort-add" onClick={() => onChangeOrder("no")}>
                        {"No"}
                        <div className={`headerSort ${checkedSorting("no", requestData.order, requestData.orderType)}`}></div>
                    </div>
                ),
            },
            { id: "categoryName", accessorKey: "categoryName", header: g("category") },
            {
                id: "title",
                accessorKey: "title",
                header: g("title"),
                isClick: true,
                cell: (props: CellProps) => props.getValue(),
            },
            {
                id: "pocList",
                accessorKey: "pocList",
                header: g("viewPoc"),
                accessorFn: (row: FAQListType): string =>
                    row.isAll ? g("label.all") : row.pocList.map((item: { name: string }) => item.name).join(", "),
            },
            {
                id: "readCnt",
                accessorKey: "readCnt",
                header: () => {
                    return (
                        <div className="headerSort-add" onClick={() => onChangeOrder("readCnt")}>
                            {g("readCount")}
                            <div className={`headerSort ${checkedSorting("readCnt", requestData.order, requestData.orderType)}`}></div>
                        </div>
                    )
                },
            },
            {
                id: "viewDt",
                accessorKey: "viewDt",
                header: () => {
                    return (
                        <div className="headerSort-add" onClick={() => onChangeOrder("viewDt")}>
                            {g("viewDate")}
                            <div className={`headerSort ${checkedSorting("viewDt", requestData.order, requestData.orderType)}`}></div>
                        </div>
                    )
                },
                accessorFn: (row: FAQListType) => (row.viewYn !== "0" ? convert2Utc(row.viewDt, DATE_FORMAT_LINE) : "-"),
            },
            {
                id: "viewYn",
                accessorKey: "viewYn",
                header: g("viewYn"),
                cell: ({ row }: CellProps) => {
                    const { styleType, title } = getLabel(row.original.viewYn as string)
                    return <Labels styleType={styleType}>{g(title)}</Labels>
                },
            },
            {
                id: "updateDt",
                accessorKey: "updateDt",
                header: () => {
                    return (
                        <div className="headerSort-add" onClick={() => onChangeOrder("updateDt")}>
                            {g("updateDateTime")}
                            <div className={`headerSort ${checkedSorting("updateDt", requestData.order, requestData.orderType)}`}></div>
                        </div>
                    )
                },
                accessorFn: (row: FAQListType): string => `${convert2Utc(row.updateDt)}(${row.updateId})`,
            },
        ],
        [requestData]
    )

    return (
        <>
            <Layer.DividerHeader
                icon={DividerIcon.format}
                title={t("faqList")}
                isFetching={isFetching}
                refreshEvent={() => {
                    requestData.page == PAGINATION_FORMAT.DEFAULT_PAGE
                        ? setList()
                        : setRequestData(prev => ({ ...prev, page: PAGINATION_FORMAT.DEFAULT_PAGE }))
                }}
            />
            <div className="table-top-wrap">
                <div className="total-count">
                    <label>{g("totalCount", { val: getComma(faqList.totalCount) })}</label>
                </div>
                <Button onClick={() => showDetail()} styleType={ButtonStyleType.primary}>
                    {g("button.regist")}
                </Button>
            </div>
            <TsTable
                theme={TableTheme.lined}
                keyName="noId"
                columns={tsColumns}
                rows={faqList.list}
                onClickHandler={showDetail}
                isLoading={isFetching}
            />
            <Pagination offset={requestData.page} limit={requestData.size} total={faqList.totalCount} onChange={controlPage} />
        </>
    )
}

export default React.memo(FAQList)
