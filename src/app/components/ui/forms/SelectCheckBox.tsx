import React from 'react'
import { CheckItemBySelectBox, MultiSelectBoxItem } from '@/components/ui/forms/types'
import CheckBox from '@/components/ui/forms/CheckBox'
import { useTranslation } from 'react-i18next'
import { T_NAMESPACE } from '@/utils/resources/constants'

interface SelectCheckBoxProps {
    items: Array<CheckItemBySelectBox>
    onChange?: (items: Array<MultiSelectBoxItem>) => void
    useAllCheckbox?: boolean
}

/**
 * @description Selecbox 내에 사용하는 CheckboxList
 * @param useAllCheckbox 전체 체크박스 사용여부
 * @param onChange
 * @param items checkbox items
 * @constructor
 */
const SelectCheckBox = ({ useAllCheckbox = false, onChange, items = [] }: SelectCheckBoxProps) => {
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)

    /**
     * checkbox handler
     * @param checkItem
     */
    const handleChange = (checkItem: CheckItemBySelectBox) => {
        const checkboxList = items.map(item =>
            item.value !== checkItem.value
                ? item
                : {
                      ...item,
                      isChecked: !item.isChecked,
                  }
        )
        onChange(checkboxList)
    }

    /** Checkbox all change event */
    const handleAllChange = (checked: boolean) => {
        onChange(items.map(item => ({ ...item, isChecked: checked })))
    }

    return (
        <div className="em-check-list">
            {useAllCheckbox && (
                <label className="em-check-item" key={'ALL'}>
                    {g('label.all')}
                    <CheckBox onChange={e => handleAllChange(e.target.checked)} isChecked={items.every(item => item.isChecked)} />
                </label>
            )}
            {!!items &&
                items.map((item: CheckItemBySelectBox) => {
                    return (
                        <label className="em-check-item" key={item.value}>
                            {item.label ?? ''}
                            <CheckBox onChange={() => handleChange(item)} isChecked={item.isChecked} />
                        </label>
                    )
                })}
        </div>
    )
}

export default SelectCheckBox
