import React, { useCallback, useMemo, useState } from "react"
import { RequestPage } from "@/utils/apis/request.types"
import { PAGINATION_FORMAT, T_NAMESPACE, T_PREFIX } from "@/utils/resources/constants"
import { TableTheme } from "@/utils/resources/types"
import { useTranslation } from "react-i18next"
import { convert2Utc } from "@/utils/common"
import Pagination from "@/components/ui/table/Pagination"
import { API } from "@/utils/apis/request.const"
import { applyQueryString } from "@/utils/apis/request"
import { useRequest } from "@/contexts/SendApiContext"
import TsTable from "@/components/ui/table/TsTable"
import { HistoryType, UserHistoryType } from "./types"

const defaultValue: HistoryType = {
    list: [],
    totalCount: 0,
}
const defaultPageOffset = {
    page: PAGINATION_FORMAT.DEFAULT_PAGE,
    size: PAGINATION_FORMAT.DEFAULT_LIMIT,
    search: PAGINATION_FORMAT.DEFAULT_KEYWORD,
}

const LoginLog = () => {
    const { t } = useTranslation(T_NAMESPACE.INTRO, { keyPrefix: T_PREFIX.MYPAGE })
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
    const { useFetch } = useRequest()
    const keyName = useMemo(() => "no", [])
    const tsColumns = useMemo(
        () => [
            { id: "no", accessorKey: "no", header: "No" },
            { id: "historyDesc", accessorKey: "historyDesc", header: t("history") },
            {
                id: "historyDate",
                accessorKey: "historyDate",
                header: t("accessDay"),
                accessorFn: (row: UserHistoryType) => convert2Utc(row.historyDate),
            },
            { id: "ip", accessorKey: "ip", header: t("accessIp") },
        ],
        []
    )

    const [pageOffset, setPageOffset] = useState<RequestPage>(defaultPageOffset)
    const [data, setData] = useState<HistoryType>(defaultValue)

    useFetch<HistoryType>(
        { url: applyQueryString(API.USER_HISTORY, { ...pageOffset }) },
        {
            onSuccess: (res: HistoryType) => setData(res),
        }
    )

    // Pagination
    const controlPage = useCallback((page: number) => {
        setPageOffset(prev => ({ ...prev, page }))
    }, [])

    return (
        <div className="login-log">
            <TsTable theme={TableTheme.lined} keyName={keyName} columns={tsColumns} rows={data.list} noResultMsg={g("noResultMessage")} />
            <Pagination offset={pageOffset.page} limit={pageOffset.size} total={data.totalCount} onChange={controlPage} />
        </div>
    )
}

export default React.memo(LoginLog)
