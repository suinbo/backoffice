import { RowItem } from "@/utils/resources/types"
import React, { ReactChild, SetStateAction, useContext, useMemo } from "react"
import { createContext } from "react-activation"

const TsTableCheckListContext = createContext<{
    checkList: Array<string>
    blockCheckList: Array<string>
    setCheck: (checkId: string) => void
    setCheckAll: () => void
    isAllCheck: boolean
}>({ checkList: [], blockCheckList: [], setCheck: () => ({}), setCheckAll: () => ({}), isAllCheck: false })

export const useTsTableCheck = () => useContext(TsTableCheckListContext)

/**
 * @param keyName Table KeyName
 * @param rows Table Rows
 * @param checkList Table Check List
 * @param blockList Items not to check on a table
 * @param blockCheckList Items not to check on a table
 * @param requiredItems Table Row Required Line Check Items
 * @function setCheckList Table Setting CheckList
 * @function onCheckedHandler Table Checked Event Handler
 * @returns
 */
export const TsTableCheckBoxProvider = React.memo(
    ({
        keyName,
        rows = [],
        checkList = [],
        blockList = [],
        blockCheckList = [],
        setCheckList,
        onCheckedHandler,
        children,
    }: {
        keyName: string
        rows: Array<RowItem>
        checkList: Array<string>
        blockList: Array<string>
        blockCheckList: Array<string>
        setCheckList: React.Dispatch<SetStateAction<Array<string>>>
        onCheckedHandler: (rows: RowItem[] | RowItem, isRadio?: boolean) => void
        children: ReactChild
    }) => {
        const keyNameList = useMemo(() => rows.map(item => item[keyName]), [rows])
        const allCheckList = useMemo(() => keyNameList.filter(id => !blockList.includes(id)), [keyNameList, blockList])
        const isAllCheck = useMemo(
            () =>
                rows.length &&
                (allCheckList.length ? allCheckList.every(id => checkList.includes(id)) : keyNameList.every(id => checkList.includes(id))),
            [rows, checkList, allCheckList]
        )

        const setCheckAll = () => {
            isAllCheck ? setCheckList(prev => prev.filter(id => !allCheckList.includes(id))) : setCheckList(prev => [...prev, ...allCheckList])
            onCheckedHandler && onCheckedHandler(rows)
        }

        const setCheck = (checkId: string) => {
            setCheckList((prev: string[]) =>
                blockList.includes(checkId) ? prev : prev.includes(checkId) ? prev.filter(item => item !== checkId) : [...prev, checkId]
            )
        }

        return (
            <TsTableCheckListContext.Provider value={{ checkList, blockCheckList, setCheck, setCheckAll, isAllCheck }}>
                {children}
            </TsTableCheckListContext.Provider>
        )
    }
)
