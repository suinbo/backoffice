import React, { useEffect, useMemo, useRef } from "react"
import { useTsTableCheck } from "@/contexts/TsTableContext"

interface CheckBoxProps {
    keyName?: string
}

/**
 * @param keyName Table keyName
 * @returns
 */
const TsCheckBox = ({ keyName }: CheckBoxProps) => {
    const ref = useRef<HTMLInputElement>(null)
    const { checkList, setCheck, blockCheckList } = useTsTableCheck()
    const checked = useMemo(() => checkList.includes(keyName), [checkList])
    const disable = useMemo(() => !!blockCheckList.includes(keyName), [blockCheckList])

    useEffect(() => {
        const tr = ref.current.closest(".em-table-tr")
        if (checked) {
            tr?.classList.add("checked")
        } else {
            tr?.classList.remove("checked")
        }
    })

    return (
        <div className="em-checkbox-td em-checkbox-check">
            <input
                ref={ref}
                type="checkbox"
                onClick={e => {
                    e.stopPropagation()
                    setCheck(keyName)
                }}
                checked={checked}
                disabled={disable}
                readOnly={true}
            />
        </div>
    )
}

export default React.memo(TsCheckBox)
