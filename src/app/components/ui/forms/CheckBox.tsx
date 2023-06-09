import React from "react"
import { CheckBoxProps } from "@/utils/resources/types"

/**
 * @description Checkbox Component
 * @param onChange checkbox onChange event handler
 * @param isChecked 체크 여부
 * @param isDim 선택 불가 여부
 * @constructor
 */
const Checkbox = ({ onChange = () => ({}), id = "inputCheck", isChecked = false, isDim = false }: CheckBoxProps) => {
    return (
        <div className="em-checkbox-td em-checkbox-check">
            <input type="checkbox" id={id} onChange={onChange} checked={isChecked} disabled={isDim} />
        </div>
    )
}

export default Checkbox
