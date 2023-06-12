import React from "react"
import { useTsTableCheck } from "@/contexts/TsTableContext"

const TsHeaderCheckBox = () => {
    const { isAllCheck, setCheckAll } = useTsTableCheck()

    return (
        <div className="em-checkbox-td em-checkbox-check">
            <input
                type="checkbox"
                onClick={e => {
                    e.stopPropagation()
                    setCheckAll()
                }}
                checked={isAllCheck}
                readOnly={true}
            />
        </div>
    )
}

export default React.memo(TsHeaderCheckBox)
