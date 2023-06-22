import React, { useCallback, useRef } from "react"
import { DeleteRounded } from "@material-ui/icons"
import { SelectBoxItem, SelectBoxListItem } from "@/components/ui/forms/types"
import { Selectbox } from "@/components/ui/forms"
import { SelectBoxListProp } from "./types"
import { useTranslation } from "react-i18next"
import { T_NAMESPACE } from "@/utils/resources/constants"

//셀렉박스 폼
const SelectBoxForm: React.FC<{
    item: SelectBoxListItem
    selectList: SelectBoxItem[]
    onSelectBoxChange: (inputItem: SelectBoxItem) => void
    parentRef: React.Ref<HTMLDivElement | null>
}> = ({ item, selectList, onSelectBoxChange, parentRef, children }) => {
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
    const defaultItem = item.selectBoxItem.value || item.selectBoxItem.label ? item.selectBoxItem : undefined

    return (
        <div className="new default">
            {item.origin ? (
                <div className="default">
                    <label> {item.selectBoxItem.label ?? item.selectBoxItem.value} </label>
                </div>
            ) : (
                <Selectbox
                    defaultLabel={g("label.onChoose")}
                    defaultItem={defaultItem}
                    items={selectList}
                    onChange={onSelectBoxChange}
                    isBoxIn={true}
                    ref={parentRef}
                />
            )}
            {children}
        </div>
    )
}

const SelectBoxList: React.FC<SelectBoxListProp> = ({
    listItems, //리스트에 보일 목록
    selectList, //셀렉박스에 보일 목록
    emptyLabel = "", //listItems가 비었을시 나타낼 문구
    inputLabel = "", //input placeholder에 들어갈 문구
    setlistItems = () => ({}), //상태 저장할set함수
    readonly = false, // 읽기전용
}) => {
    const scrollRef = useRef<HTMLDivElement>(null)

    // 셀렉터 박스 삭제 이벤트
    const delSelectBox = (idx: number) => {
        setlistItems(listItems.filter((item, i) => i !== idx))
    }

    // 셀렉터 Input 값 변경 이벤트
    const inputChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        setlistItems(
            listItems.map((item, i) => {
                idx === i && (item.inputValue = e.target.value)
                return item
            })
        )
    }

    // 카테고리 변경 이벤트
    const onSelectBoxChange = useCallback(
        (idx: number, inputItem: SelectBoxItem) => {
            setlistItems(
                listItems.map((item, i) => {
                    idx === i && (item.selectBoxItem = inputItem)
                    return item
                })
            )
        },
        [listItems]
    )

    return (
        <div className="add-registration">
            <div className="scroll" ref={scrollRef}>
                {listItems.length ? (
                    listItems.map((item, idx) => (
                        <SelectBoxForm
                            key={`SelectBoxList_${item.selectBoxItem.value}_${idx}`}
                            item={item}
                            selectList={selectList}
                            onSelectBoxChange={item => onSelectBoxChange(idx, item)}
                            parentRef={scrollRef}>
                            <input
                                type="text"
                                placeholder={inputLabel}
                                value={item.inputValue}
                                onChange={e => inputChange(e, idx)}
                                readOnly={readonly}
                            />
                            {!readonly && <DeleteRounded className="delete" onClick={() => delSelectBox(idx)} />}
                        </SelectBoxForm>
                    ))
                ) : (
                    <div className="no-result"> {emptyLabel} </div>
                )}
            </div>
        </div>
    )
}

export default SelectBoxList
