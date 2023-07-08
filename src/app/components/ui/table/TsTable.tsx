import React, {
    ChangeEvent,
    DragEvent,
    UIEvent,
    Fragment,
    useEffect,
    useRef,
    useState,
    forwardRef,
    MutableRefObject,
    useCallback,
    useMemo,
} from "react"
import { useToolTip } from "@/contexts/ToolTipContext"
import { T_NAMESPACE } from "@/utils/resources/constants"
import { ArrowDropDown, ArrowDropUp, DragHandle } from "@material-ui/icons"
import { ColumnOrderState, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { isCheckChange, makeGroupData, onScrollHandler, setGroupHeaderList, setGroupList, TS_COLUMN } from "./TsUtils"
import { RowItem, TsColumn, TsTableType, HeaderItem, HeaderGroupItem, CellItem, RowItems } from "./tsTypes"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/buttons"
import { ButtonStyleType } from "@/components/ui/buttons/types"
import { Selectbox } from "@/components/ui/forms"
import { SelectBoxItem } from "@/components/ui/forms/types"
import { TsTableCheckBoxProvider } from "@/contexts/TsTableContext"
import Blind from "@/components/ui/blind"
import TsCheckBox from "./TsCheckBox"
import TsHeaderCheckBox from "./TsHeaderCheckBox"
import TsRadio from "./TsRadio"
import Loading from "@/components/ui/spinner"
import cx from "classnames"
import "./styles.scss"

/**
 * @param keyName Table KeyName
 * @param theme Table Theme Style
 * @param rows Table Rows
 * @param columns Table Columns
 * @param radioId Table Radio ID
 * @param activeId Table Activated ID
 * @param dimList Table Dim Id List
 * @param diblockCheckListmList Items not to check on a table
 * @param checkList Table Check List
 * @param groupColumn Table Grouping Column
 * @param isLoading Table Loading Bar Check
 * @param isResize Table Columne Resizing
 * @param isColumnSorting Table column Sorting
 * @param isColumnOrdering Table Column Ordering
 * @param isDisabledRadioKey Table Radio Disable row keyName
 * @param requiredItems Table Row Required Line Check Items
 * @function setCheckList Table Setting CheckList
 * @function onDrop Table Row DnD Index Setting
 * @function onSelect TAble Row SelectBox Selected Event Handler
 * @function onClickHandler Table Click Event Handler
 * @function onCheckedHandler Table Checked Event Handler
 * @function onChangeRows Table State Rows Change
 * @function onScrollChange Table Scroll Paging
 * @param noResultMsg Table no result message
 * @returns
 */
const TsTableRenderer = React.memo(
    forwardRef<HTMLDivElement, TsTableType>(
        (
            {
                keyName,
                theme,
                addClassName,
                columns,
                rows,
                radioId,
                activeId,
                dimList = [],
                requiredList = [],
                redActiveList = [],
                groupColumn,
                isLoading = false,
                isResize = false,
                isColumnSorting = false,
                isColumnOrdering = false,
                isDisabledRadioKey = "",
                selectOption,
                requiredItems = { requireKey: "", checkKey: [], requireValue: [] },
                onDrop,
                onSelect,
                onClickHandler,
                onCheckedHandler,
                onChangeRows,
                onDeletedHandler,
                onScrollChange,
                onCheckRow,
                noResultMsg,
                children,
            }: TsTableType,
            ref: MutableRefObject<HTMLDivElement>
        ) => {
            const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
            const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(isColumnOrdering ? columns.map(column => column.id) : [])
            const tableRef = useRef<HTMLDivElement>(null)
            const { tooltipHandler, setOnMouse } = useToolTip()
            const [tsRows, setTsRows] = useState<RowItem[]>([])

            useEffect(() => {
                if (tableRef.current && ref) ref.current = tableRef.current
            }, [ref])

            useEffect(() => (rows.length ? setTsRows([...rows]) : setTsRows([])), [rows])
            useEffect(() => onChangeRows && onChangeRows(tsRows), [tsRows])

            const tsTable = useReactTable({
                data: groupColumn ? makeGroupData(tsRows, groupColumn) : tsRows,
                columns,
                state: { columnOrder },
                columnResizeMode: "onChange",
                getSubRows: row => row.subRows as RowItem[],
                onColumnOrderChange: setColumnOrder,
                getCoreRowModel: getCoreRowModel(),
                getSortedRowModel: isColumnSorting && getSortedRowModel(),
                meta: {
                    updateList: (value: string, rowIndex: number, columnId: string) => {
                        setTsRows((prev: RowItem[]) =>
                            prev.map((row: RowItem, index: number) => (index === rowIndex ? { ...row, [columnId]: value } : row))
                        )
                    },
                    getTableRef: () => tableRef,
                },
            })

            /** Column Drag&Drop Event Handler
             * @param data Header Column Data
             * @param event DragEvent
             */
            const columnDndHandler = (data: HeaderItem, event: DragEvent<HTMLDivElement>) => {
                if (isColumnOrdering) {
                    if (event.type === "dragstart") {
                        isColumnOrdering ? event.dataTransfer.setData("dragIndex", data.index.toString()) : event.preventDefault()
                    } else if (event.type === "drop") {
                        if (event.dataTransfer.getData("dragIndex")) {
                            const dragIdx = Number(event.dataTransfer.getData("dragIndex"))
                            const dropIdx = data.index
                            columnOrder.splice(dropIdx, 0, columnOrder.splice(dragIdx, 1)[0])
                            setColumnOrder([...columnOrder])
                            event.currentTarget.style.opacity = "1"
                        }
                    } else event.preventDefault()
                }
            }

            /** Table Header Renderer Convert */
            const convertHeaderRenderer = (headerGroup: HeaderGroupItem) => {
                // 그룹화가 필요한 행이 있을 경우 헤더 형태도 같이 변환
                const getGroupHeader = setGroupHeaderList(headerGroup.headers)
                return (
                    <Fragment key={`groupHeader_${headerGroup.id}`}>
                        {getGroupHeader.map((headers: HeaderItem[], groupIndex: number) => {
                            const headerRender = headers.map((header: HeaderItem) => headerRenderer(header))
                            return headers.length === 1 ? (
                                headerRender
                            ) : (
                                <div className="ts-table-header" key={`base_${groupIndex}`}>
                                    {headerRender}
                                </div>
                            )
                        })}
                    </Fragment>
                )
            }

            /** Table Header Renderer */
            const headerRenderer = (header: HeaderItem) => {
                if (header.column.id === TS_COLUMN.CHECK) {
                    return (
                        <Fragment key={`column_${header.id}`}>
                            <TsHeaderCheckBox />
                        </Fragment>
                    )
                } else {
                    const isHeaderGroup = header?.subHeaders.length // 헤더 항목 그룹화 여부
                    return isHeaderGroup ? headerGroupRenderer(header) : headerBasicRenderer(header)
                }
            }

            /** Table Header Group Renderer */
            const headerGroupRenderer = (header: HeaderItem) => {
                const { id: headerId, colSpan, column, subHeaders } = header
                return colSpan > 1 ? (
                    <div className="em-table-td em-table-group" key={`column_${headerId}`}>
                        <span className="em-table-data group">{flexRender(column.columnDef.header, header.getContext())}</span>
                        <div className="em-table-sub">{subHeaders.map(subHeader => headerBasicRenderer(subHeader))}</div>
                    </div>
                ) : (
                    headerBasicRenderer(subHeaders[0])
                )
            }

            /** Table Header Basic Renderer */
            const headerBasicRenderer = (header: HeaderItem) => {
                const headerColumn = header.column
                const isPointer = header.id !== TS_COLUMN.CHECK && header.id !== TS_COLUMN.DRAG // 마우스 커서 아이콘 변경이 필요 없는 항목 체크
                const headerItem = flexRender(headerColumn.columnDef.header, header.getContext())
                const { isRequired } = headerColumn.columnDef as TsColumn

                return (
                    <div
                        key={`column_${header.id}`}
                        className={cx([groupColumn ? "ts-table-td" : "em-table-td", { pointer: isPointer && (isColumnOrdering || isColumnSorting) }])}
                        // style={{ flexBasis: header.getSize() }}
                        draggable={isColumnOrdering}
                        onDragStart={event => columnDndHandler(header, event)}
                        onDragOver={event => columnDndHandler(header, event)}
                        onDragEnter={event => isColumnOrdering && (event.currentTarget.style.opacity = ".3")}
                        onDragLeave={event => (event.currentTarget.style.opacity = "1")}
                        onDrop={event => columnDndHandler(header, event)}
                        onClick={() => isColumnSorting && headerColumn.getToggleSortingHandler()}>
                        <span
                            className="em-table-data"
                            onMouseEnter={event => typeof headerItem === "string" && tooltipHandler(event, true, headerItem)}
                            onMouseLeave={() => setOnMouse(false)}>
                            {headerItem}
                            {isRequired && <span className="required" />}
                        </span>
                        {isResize && (
                            <div
                                className={`em-resizer ${header.column.getIsResizing() ? "isResizing" : ""}`}
                                onMouseDown={header.getResizeHandler()}
                                onTouchStart={header.getResizeHandler()}
                            />
                        )}
                        {header.id !== TS_COLUMN.DRAG &&
                            isColumnSorting &&
                            ({ asc: <ArrowDropUp />, desc: <ArrowDropDown /> }[headerColumn.getIsSorted() as string] ?? null)}
                    </div>
                )
            }

            /** Table Row Click Event */
            const clickEvent = (data: string) => {
                onClickHandler(data)
                setOnMouse(false)
            }

            /** Cell Drag&Drop Event Handler
             * @param cell Cell Data
             */
            const cellDndHandler = (cell: CellItem, event: DragEvent<HTMLDivElement>) => {
                const target = event.currentTarget
                if (event.type === "dragstart") {
                    // Drag&Drop 아이콘에서만 Drag 기능 작동하도록 적용
                    if (cell.column.id === TS_COLUMN.DRAG) {
                        // 드래그 가상 이미지 X 좌표 위치
                        const dragSetLeft =
                            target.offsetLeft === target.parentElement.offsetLeft ? target.offsetLeft - target.offsetWidth : target.offsetLeft
                        event.dataTransfer.setDragImage(target.parentElement, dragSetLeft, 0) // Drag할 때 보이는 이미지를 드래그 하는 행으로 보이도록 설정
                        event.dataTransfer.setData("dragIndex", cell.row.index.toString()) // 드래그하는 행의 index를 dataTransfer에 저장
                    } else event.preventDefault()
                } else if (event.type === "drop") {
                    if (event.dataTransfer.getData("dragIndex")) {
                        // dataTransfer에 저장된 index가 있을 경우에만 작업 진행
                        const dragIdx = Number(event.dataTransfer.getData("dragIndex"))
                        const dropIdx = cell.row.index
                        if (dragIdx !== dropIdx) onDrop && onDrop({ dragIdx, dropIdx })
                        event.currentTarget.parentElement.style.opacity = "1"
                    }
                } else if (event.type === "drag") {
                    // 드래그 하면서 스크롤도 같이 이동할 수 있게 적용
                    const { top, bottom } = tableRef.current.getBoundingClientRect() // 테이블 좌표 정보
                    const topPosition = scrollY + top + target.offsetHeight // 상단 절대 위치
                    const bottomPosition = scrollY + bottom - target.offsetHeight // 하단 절대 위치
                    if (event.pageY <= topPosition) tableRef.current.scrollTop -= 20 // 드래그 마우스 상단을 향하고 있는 경우
                    if (event.pageY >= bottomPosition) tableRef.current.scrollTop += 20 // 드래그 마우스 하단을 향하고 있는 경우
                } else event.preventDefault()
            }

            /** Table Row Renderer */
            const rowRenderer = (row: RowItems) => {
                const rowData = row.original
                const rowId = rowData[keyName] as string
                const isActive = !!activeId && activeId === rowId
                const isDim = dimList.includes(rowId)
                const rowList = row.getVisibleCells()
                const isClick = columns.some(item => item.isClick)

                // 테이블 리스트에서 필수 체크를 나타내주는 부분이 있어 추가
                const { requireKey, checkKey, requireValue } = requiredItems
                const isRequired = requireValue.includes(rowData[requireKey] as string) ? !checkKey.some(key => !!rowData[key]) : false
                const isRedActive = redActiveList.includes(rowData[requireKey] as string) ? !checkKey.some(key => !!rowData[key]) : false
                const isRadio = rowList.some((cell: CellItem) => cell.column.id === TS_COLUMN.RADIO) // 라디오 버튼이 있는지 확인
                const isOneClick = rowList.some((cell: CellItem) => {
                    const columnDef = cell.column.columnDef as TsColumn
                    return columnDef.isOneClick
                })

                return (
                    <div
                        key={`row_${row.index}`}
                        className={cx("em-table-tr", {
                            active: isActive,
                            dim: isDim,
                            "red-line": requiredList.includes(rowId) || isRequired,
                            "red-active": redActiveList.includes(rowId) || isRedActive,
                        })}
                        onClick={() => {
                            if (onClickHandler) {
                                !isClick && onClickHandler(rowId)
                            } else {
                                !isRadio && onCheckRow(rowId)
                                !isOneClick && onCheckedHandler && onCheckedHandler(rowData, isRadio)
                            }
                        }}>
                        {rowList.map((cell: CellItem) => cellRenderer(cell))}
                    </div>
                )
            }

            /** Table Cell Renderer */
            const cellRenderer = (cell: CellItem, isGroup = false) => {
                const { columnDef, id: columnId } = cell.column
                const cellItem = flexRender(columnDef.cell, cell.getContext())
                const clickColumns = columns.filter(item => item.isClick).map(data => data.id) // Click Clumn ID
                const isClick = clickColumns.includes(columnId) // Click 기능이 필요한 항목인지 확인
                const isDraggable = columnId === TS_COLUMN.DRAG // Drag&Drop 항목 존재 여부 확인
                const tooltipHide = columns.filter(item => item.toolTipHide).map(data => data.id) // Tooltip Hide Column ID
                const rowData = cell.row.original
                const keyRowId = rowData[keyName] as string
                const isDimCheck = dimList.includes(keyRowId)

                switch (columnId) {
                    case TS_COLUMN.CHECK: // CheckBox 생성
                        return (
                            <Fragment key={`${keyRowId}_${cell.id}`}>
                                <TsCheckBox keyName={keyRowId} />
                            </Fragment>
                        )
                    case TS_COLUMN.RADIO: // Radio 생성
                        return (
                            <Fragment key={`${keyRowId}_${cell.id}`}>
                                <TsRadio
                                    key={`tsTableRadio_${keyRowId}_${cell.id}`}
                                    name={`tsTableRadio_${keyRowId}`}
                                    id={`radio_${keyRowId}`}
                                    isChecked={isDimCheck ? false : radioId === keyRowId}
                                    onChange={(event: ChangeEvent<HTMLDivElement>) => {
                                        event.stopPropagation()
                                        !isDimCheck && onCheckedHandler && onCheckedHandler(rowData, true)
                                    }}
                                    mainClassName={isGroup ? "ts-table-td" : "em-table-td"}
                                    disableItem={rowData[isDisabledRadioKey] as string}
                                />
                            </Fragment>
                        )
                    default:
                        return (
                            <div
                                key={`${keyRowId}_${cell.id}`}
                                className={cx(isGroup ? "ts-table-td" : "em-table-td", { "text-emphasize": isClick })}
                                // style={{ flexBasis: cell.column.getSize() }}
                                onClick={() => isClick && clickEvent(keyRowId)}
                                draggable={isDraggable}
                                onDrag={event => cellDndHandler(cell, event)}
                                onDragStart={event => cellDndHandler(cell, event)}
                                onDragOver={event => cellDndHandler(cell, event)}
                                onDragEnter={event => isDraggable && (event.currentTarget.parentElement.style.opacity = ".3")}
                                onDragLeave={event => (event.currentTarget.parentElement.style.opacity = "1")}
                                onDrop={event => cellDndHandler(cell, event)}>
                                <span
                                    className={isGroup ? "ts-table-data" : "em-table-data"}
                                    onMouseEnter={event => tooltipHandler(event, !tooltipHide.includes(columnId), cellItem)}
                                    onMouseLeave={() => setOnMouse(false)}>
                                    {isDraggable ? (
                                        <DragHandle className="drag-icon" />
                                    ) : TS_COLUMN.DEL_BTN === columnId ? (
                                        <Button
                                            styleType={ButtonStyleType.default}
                                            border={true}
                                            onClick={e => {
                                                e.stopPropagation()
                                                onDeletedHandler(rowData)
                                            }}>
                                            {g("button.delete")}
                                        </Button>
                                    ) : TS_COLUMN.SELECT_BOX === columnId ? (
                                        <Selectbox
                                            ref={tableRef}
                                            key={`select_${keyRowId}_${cell.id}`}
                                            {...selectOption}
                                            isTableIn={true}
                                            defaultLabel={rowData[selectOption.defaultLabel] as string}
                                            onChange={(item: SelectBoxItem) => onSelect(item, rowData)}
                                        />
                                    ) : (
                                        cellItem
                                    )}
                                </span>
                            </div>
                        )
                }
            }

            /** Table Group Row Renderer */
            const groupRenderer = (row: RowItems) => {
                const getGroupRows = setGroupList(row.getVisibleCells())
                const rowData = row.original
                const rowId = rowData[keyName] as string
                return (
                    <div className={cx("ts-table-group-tr", { "red-active": redActiveList.includes(rowId) })} key={`group_${row.depth}${row.index}`}>
                        {getGroupRows.map((rows: CellItem[], index: number) => {
                            const columnId = rows.map((cell: CellItem) => cell.column.id)
                            return rows.length === 1 ? (
                                <div className="ts-table-group-td" key={`groups_${rows[0].id}`}>
                                    {cellRenderer(rows[0], true)}
                                </div>
                            ) : (
                                <div className="ts-table-data-tr" key={`rows_${index}`}>
                                    <div className="ts-table-tr">{rows.map((cell: CellItem) => cellRenderer(cell, true))}</div>
                                    {row.subRows.map((row: RowItems) => groupRowRenderer(row, columnId))}
                                </div>
                            )
                        })}
                    </div>
                )
            }

            /** Table Group Cell Renderer */
            const groupRowRenderer = (row: RowItems, columnId: string[]) => {
                return (
                    <div className="ts-table-tr" key={`groupRow_${row.id}`}>
                        {row.getVisibleCells().map((cell: CellItem) => columnId.includes(cell.column.id) && cellRenderer(cell, true))}
                    </div>
                )
            }

            return (
                <>
                    <div
                        className={cx("em-table", theme || "", addClassName || "")}
                        ref={tableRef}
                        onScroll={(e: UIEvent) => onScrollHandler(e, isLoading, onScrollChange)}>
                        <div className="em-table-head">
                            <div className="em-table-tr">
                                {tsTable
                                    .getHeaderGroups()
                                    .map(
                                        (headerGroup, idx) =>
                                            !idx &&
                                            (groupColumn
                                                ? convertHeaderRenderer(headerGroup)
                                                : headerGroup.headers.map(header => headerRenderer(header)))
                                    )}
                            </div>
                        </div>
                        <div className="em-table-body">
                            {isLoading && (
                                <div className="loading-box">
                                    <Loading />
                                </div>
                            )}
                            {tsTable.getRowModel().rows.length ? (
                                tsTable.getRowModel().rows.map(row => (groupColumn ? groupRenderer(row) : rowRenderer(row)))
                            ) : (
                                <Blind text={isLoading ? "" : noResultMsg ?? g("noSearchResult")} />
                            )}
                        </div>
                        {children}
                    </div>
                </>
            )
        }
    ),
    (prevProps, nexProps) => {
        const filteredKeys = Object.keys(prevProps).filter(key => !["checkList", "blockCheckList"].includes(key))
        let key = ""
        for (let i = 0; i < filteredKeys.length; i++) {
            key = filteredKeys[i]
            if (prevProps[key] !== nexProps[key]) return false
        }
        return true
    }
)

const TsTable = forwardRef<HTMLDivElement, TsTableType>((props: TsTableType, ref: MutableRefObject<HTMLDivElement>) => {
    const { keyName, rows, checkList, blockCheckList, dimList, setCheckList, onCheckedHandler } = props

    const blockCheckListRef = useRef<Array<string>>([])
    const blockList = useMemo(() => [...blockCheckList, ...dimList], [blockCheckList, dimList])
    blockCheckListRef.current = blockList

    const onCheckRow = useCallback((checkId: string) => {
        !blockCheckListRef.current.includes(checkId) && isCheckChange(checkId, setCheckList)
    }, [])

    return (
        <TsTableCheckBoxProvider
            keyName={keyName}
            rows={rows}
            checkList={checkList}
            blockCheckList={blockCheckList}
            blockList={blockList}
            setCheckList={setCheckList}
            onCheckedHandler={onCheckedHandler}>
            <TsTableRenderer {...props} onCheckRow={onCheckRow} ref={ref} />
        </TsTableCheckBoxProvider>
    )
})

export default React.memo(TsTable)
