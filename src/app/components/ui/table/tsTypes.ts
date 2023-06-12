import { TableTheme } from "@/utils/resources/types"
import { Cell, Column, ColumnDef, Header, HeaderGroup, Row, Table } from "@tanstack/react-table"
import React, { ReactNode, SetStateAction } from "react"
import { SelectBoxItem, SelectboxProp } from "../forms/types"

export type RowItem = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
}

export type HeaderGroupItem = HeaderGroup<RowItem>
export type HeaderItem = Header<RowItem, unknown>
export type CellItem = Cell<RowItem, unknown>
export type RowItems = Row<RowItem>

export type TsColumn = {
    isClick?: boolean
    isGroup?: boolean
    isOneClick?: boolean
    isRequired?: boolean
    toolTipHide?: boolean
} & ColumnDef<RowItem>

export type TsTableType = {
    [key: string]: any
    theme: TableTheme
    keyName: string
    rows: RowItem[]
    columns: TsColumn[]
    addClassName?: string[]
    radioId?: string | number
    activeId?: string | number
    dimList?: string[]
    blockCheckList?: string[]
    requiredList?: (string | number)[]
    redActiveList?: (string | number)[]
    checkList?: string[]
    groupColumn?: string
    isLoading?: boolean
    isResize?: boolean
    isColumnSorting?: boolean
    isColumnOrdering?: boolean
    isDisabledRadioKey?: string
    selectOption?: SelectboxProp
    requiredItems?: { requireKey: string; requireValue: string[]; checkKey: string[] }
    setCheckList?: React.Dispatch<SetStateAction<string[]>>
    onDrop?: ({ dragIdx, dropIdx }: DragDrop) => void
    onSelect?: (item: SelectBoxItem, rows?: RowItem) => void
    onCheckedHandler?: (rows: RowItem[] | RowItem, isRadio?: boolean) => void
    onClickHandler?: (id: string) => void
    onChangeRows?: (list: RowItem[]) => void
    onDeletedHandler?: (rows: RowItem) => void
    onScrollChange?: (event: React.UIEvent) => void
    onCheckRow?: (checkedId: string) => void
    noResultMsg?: string
    children?: ReactNode
}

export type CellProps = {
    table: Table<RowItem> & { options: { meta: { getTableRef: () => React.MutableRefObject<HTMLDivElement> } } }
    row: Row<RowItem>
    column: Column<RowItem>
    cell: Cell<RowItem, unknown>
    getValue: () => any
    renderValue: () => any
}

export type DragDrop = { dragIdx: number; dropIdx: number }
