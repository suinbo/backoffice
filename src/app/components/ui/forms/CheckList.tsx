import React, { useEffect, useMemo, useState } from "react"
import { CheckItemProp, CheckListProp } from "./types"
import CheckBox from "./CheckBox"
import { useTranslation } from "react-i18next"
import { T_NAMESPACE } from "@/utils/resources/constants"
import cx from "classnames"

const defaultCheckedItems: [] = []

/** CheckBox list with label */
const CheckBoxList = ({
    checkBoxItems = [], //체크박스에 보일 아이템목록
    checkedItems = defaultCheckedItems, //체크된 Item
    onChange = () => ({}),
    allChecked,
    dimList = [], // 체크 불가 items
    blockEventList = [], // 체크/체크 해제 불가능 리스트
}: CheckListProp) => {
    const [checkedItem, setCheckedItem] = useState<Array<string>>([])
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)

    /** Event bus */
    useEffect(() => {
        setCheckedItem(checkedItems)
    }, [checkedItems])

    /** Checkbox change event */
    const handleChange = (value: string) => {
        const isChecked = checkedItem.includes(value)
        !blockEventList.includes(value) && setCheckedItem(state => (isChecked ? state.filter(id => id !== value) : [...state, value]))
        !blockEventList.includes(value) && onChange(isChecked ? checkedItem.filter(id => id !== value) : [...checkedItem, value], value)
    }

    const isChecked = useMemo(() => checkedItem.length != 0 && checkedItem.length === checkBoxItems.length, [checkedItem, checkBoxItems])

    /** Checkbox all change event */
    const handleAllChange = (checked: boolean) => {
        if (checked) {
            const allCheckList: React.SetStateAction<string[]> = []
            checkBoxItems.forEach(list => allCheckList.push(list.value))
            !blockEventList.length && setCheckedItem(allCheckList)
            !blockEventList.length && onChange(allCheckList)
        } else {
            !blockEventList.length && setCheckedItem([])
            !blockEventList.length && onChange([])
        }
    }

    return (
        <div className="em-check-list">
            {allChecked && (
                <label className="em-check-item" key={"ALL"}>
                    {g("label.all")}
                    <CheckBox onChange={e => handleAllChange(e.target.checked)} isChecked={isChecked} />
                </label>
            )}
            {!!checkBoxItems &&
                checkBoxItems.map((item: CheckItemProp) => {
                    const isDim = dimList.length ? dimList.includes(item.value) : false
                    return (
                        <label className={cx("em-check-item", { disabled: isDim })} key={item.value}>
                            {item.label ?? ""}
                            <CheckBox onChange={() => handleChange(item.value)} isChecked={checkedItem.includes(item.value)} isDim={isDim} />
                        </label>
                    )
                })}
        </div>
    )
}

export default React.memo(CheckBoxList)
