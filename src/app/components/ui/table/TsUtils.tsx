import React, { UIEvent, useCallback, useEffect, useRef } from "react"
import { isValidNumber } from "@/utils/resources/validators"
import { CellItem, CellProps, HeaderItem, RowItem, TsColumn } from "./tsTypes"

export const TS_COLUMN = { CHECK: "check", DRAG: "drag", RADIO: "radio", SELECT_BOX: "selectBox", DEL_BTN: "delBtn" }

/**
 * 테이블 그룹화
 * @param rows 리스트 정보
 * @param groupColumn 그룹화 항목
 * @return
 */
export const makeGroupData = (rows: RowItem[], groupColumn: string) => {
    // 병합할 항목 조회 및 리스트화
    const checkData: string[] = []
    const tsList = rows.reduce((acc: RowItem[], cur: RowItem) => {
        const columnData = cur[groupColumn] as string
        if (!checkData.includes(columnData)) {
            acc.push(...rows.filter(item => item[groupColumn] === columnData))
            checkData.push(columnData)
        }
        return acc
    }, [])

    const groupList = tsList.reduce((acc: RowItem[], cur: RowItem, idx: number) => {
        if (idx === 0) {
            acc.push({ ...cur, subRows: [] })
        } else {
            const mainData = acc.at(-1)
            const prevColumn = mainData[groupColumn]
            const curColumn = cur[groupColumn]
            const subRows = mainData.subRows as RowItem[]
            if (curColumn !== "") prevColumn === curColumn ? subRows.push(cur) : acc.push({ ...cur, subRows: [] })
            else acc.push({ ...cur, subRows: [] })
        }
        return [...acc]
    }, [])

    return groupList
}

/**
 * 테이블 병합된 열 구분 (헤더)
 * @param list 병합된 열이 포함된 리스트의 헤더 목록
 * @return
 */
export const setGroupHeaderList = (list: HeaderItem[]) => {
    let baseHeaderList: HeaderItem[] = []
    const getHeaderList = list.reduce((acc: HeaderItem[][], cur: HeaderItem, index: number) => {
        const columnDef = cur.column.columnDef as TsColumn
        if (columnDef.isGroup) {
            if (baseHeaderList.length) {
                acc.push(baseHeaderList)
                baseHeaderList = []
            }
            return acc.length ? [...acc, [cur]] : [[cur]]
        } else {
            baseHeaderList.push(cur)
            return list.length - 1 === index ? [...acc, baseHeaderList] : acc
        }
    }, [])
    return getHeaderList
}

/**
 * 테이블 병합된 열 구분
 * @param list 병합된 열이 포함된 리스트
 * @return
 */
export const setGroupList = (list: CellItem[]) => {
    let baseList: CellItem[] = []
    const getList = list.reduce((acc: CellItem[][], cur: CellItem, index: number) => {
        const columnDef = cur.column.columnDef as TsColumn
        if (columnDef.isGroup) {
            if (baseList.length) {
                acc.push(baseList)
                baseList = []
            }
            return acc.length ? [...acc, [cur]] : [[cur]]
        } else {
            baseList.push(cur)
            return list.length - 1 === index ? [...acc, baseList] : acc
        }
    }, [])
    return getList
}

/**
 * 테이블 전체 체크 박스 이벤트
 * @param keyName 리스트 키 값
 * @param rows 리스트 정보
 * @param checkList 선택된 리스트
 * @param blockCheckList 체크 되지 말아야 하는 리스트
 * @function setCheckList 체크리스트 설정
 * @return
 */
export const allCheckChange = (
    keyName: string,
    rows: RowItem[],
    checkList: Array<string>,
    setCheckList: React.Dispatch<React.SetStateAction<string[]>>,
    blockCheckList: Array<string>
) => {
    const isAll = rows
        .filter(item => !blockCheckList.includes(item[keyName] as string))
        .map((row: RowItem) => row[keyName] as string)
        .every((checkId: string) => checkList.includes(checkId))
    const checkedIds: Array<string> = [...rows].map(row => row[keyName] as string)
    if (isAll) {
        // 전체 체크박스가 선택된 상태일 때
        setCheckList(prev => [...prev.filter(item => !checkedIds.includes(item))])
    } else {
        setCheckList(prev => {
            const list = [...prev, ...checkedIds].reduce((acc, cur) => {
                acc.findIndex(item => item === cur) < 0 && acc.push(cur)
                return acc as RowItem[]
            }, [])

            return list.filter(item => !blockCheckList.includes(item)) as Array<string>
        })
    }
}

/**
 * 테이블 개별 체크 박스 이벤트
 * @param checkId 체크한 행에 대한 ID
 * @function setCheckList 체크리스트 설정
 */
export const isCheckChange = (checkId: string, setCheckList: React.Dispatch<React.SetStateAction<string[]>>) => {
    !!setCheckList && setCheckList((prev: string[]) => (prev.includes(checkId) ? prev.filter(item => item !== checkId) : [...prev, checkId]))
}

/**
 * 테이블 Editable 기능
 * @param props Cell 정보
 * @param editId Edit ID
 * @param placeholder Input 입력 칸 도움말
 * @param isNumber 숫자만 입력 가능
 * @return
 */
export const editableRender = (props: CellProps, editId: string, placeholder = "", isNumber = false, maxLength: number = null) => {
    const { row, column, table } = props
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        if (row.original[editId]) inputRef.current.value = row.original[editId]
    }, [row.original[editId]])

    const onChangeInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        if (isNumber && !isValidNumber(value)) inputRef.current.value = value.replace(/[^\d]+/g, "")
        else inputRef.current.value = value
    }, [])

    const talbeMeta = table.options.meta as { updateList: (value: string, rowIndex: number, columnId: string) => void }
    return (
        <input
            key={`tsEditId_${column.id}_${row.index}`}
            id={editId}
            type="text"
            defaultValue={inputRef.current?.value ?? ""}
            onChange={e => onChangeInput(e)}
            onBlur={() => talbeMeta?.updateList(inputRef.current?.value, row.index, column.id)}
            placeholder={placeholder}
            ref={inputRef}
            maxLength={maxLength}
        />
    )
}

/** 테이블 스크롤 페이징
 * @param event 스크롤 이벤트 데이터
 * @param isLoading 데이터 조회 중 여부
 * @function onScrollChange
 */

export const onScrollHandler = (event: UIEvent, isLoading: boolean, onScrollChange: (event: UIEvent) => void) => {
    const { scrollHeight, clientHeight, scrollTop } = event.currentTarget
    const scrollEnd = scrollHeight - (scrollTop + clientHeight + 1)
    if (scrollTop && scrollEnd < 1 && !isLoading && onScrollChange) {
        // 테이블 스크롤이 최하단으로 이동하고 데이터 조회 중이 아닐 경우
        onScrollChange(event)
    }
}
