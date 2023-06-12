import React, { useCallback, useEffect, useMemo } from "react"
import { PaginationProps } from "@/utils/resources/types"
import cx from "classnames"

const Pagination = ({ offset = 0, limit = 10, total, size = 10, onChange = () => ({}) }: PaginationProps) => {
    // 페이지 총 갯수
    const pageCount = useMemo(() => Math.ceil(total / limit), [total, limit])

    // 화면에 노출되는 페이지 목록
    const pages = useMemo(() => {
        const result = []
        const calPage = offset % size
        let startPage = offset - (calPage == 0 ? size : calPage) + 1
        const endPage = Number(startPage + size)

        for (startPage; startPage < endPage; startPage++) {
            if (startPage > pageCount) break
            else result.push(startPage)
        }

        return result
    }, [pageCount, offset])

    // 현재 노출 된 목록의 min/max 페이지
    const { maxPage, minPage } = useMemo(
        () => ({
            minPage: Math.min(...pages),
            maxPage: Math.max(...pages),
        }),
        [pages]
    )

    // 페이지 이동
    const setPage = useCallback(
        (page: number) => {
            if (page > pageCount || page < 1) return
            onChange(page)
        },
        [offset, pageCount, onChange] // 페이지네이션 변경시 전처리 이벤트 시점이 맞지 않아 의존성 추가(23.05.16 hana02031)
    )

    // pageCount 사이즈 변경에 의한 페이지 재조정
    useEffect(() => {
        if (offset > pageCount && pageCount > 0) onChange(pageCount)
    }, [pageCount])

    return (
        <div className="em-pagination">
            {pageCount > 0 ? (
                <ul className="em-page-group">
                    <li className={cx("em-page-first", { disabled: offset === 1 })} onClick={() => setPage(1)} />
                    <li className={cx("em-page-prev", { disabled: minPage === 1 })} onClick={() => setPage(minPage - 1)} />
                    {pages.map(page => (
                        <li
                            key={page}
                            className={cx("em-page-item", {
                                active: offset === page,
                            })}
                            onClick={() => setPage(page)}>
                            {" "}
                            {page}{" "}
                        </li>
                    ))}
                    <li className={cx("em-page-next", { disabled: maxPage === pageCount })} onClick={() => setPage(maxPage + 1)} />
                    <li className={cx("em-page-last", { disabled: offset === pageCount })} onClick={() => setPage(pageCount)} />
                </ul>
            ) : null}
        </div>
    )
}

export default Pagination
