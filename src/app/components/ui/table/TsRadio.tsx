import React from "react"
import cx from "classnames"

interface RadioProps {
    name: string
    id: string
    isChecked: boolean
    mainClassName?: string
    disableItem?: string
    onChange: (e: any) => void
}

const TsRadio = ({ name, id, isChecked, mainClassName = "em-table-td", disableItem = "", onChange }: RadioProps) => {
    return (
        <div className={cx(`${mainClassName} em-checkbox-radio`, { selected: isChecked })}>
            <label>
                <input
                    // 선택되어 있는 본인의 값은 체크가 되어있어야 하므로 조건 추가 (23.05.23 hana02031)
                    disabled={!!disableItem && !isChecked}
                    type={"radio"}
                    name={name}
                    key={id}
                    id={id}
                    value={id}
                    checked={isChecked}
                    onChange={onChange}
                />
            </label>
        </div>
    )
}

export default React.memo(TsRadio)
