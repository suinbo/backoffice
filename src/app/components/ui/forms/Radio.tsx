import React from "react"
import "./styles.scss"

export type RadioProps<T, K> = {
    id: T
    title: string
    value: K
}

interface RadioGroupProps<T, K> {
    name: string
    list: Array<RadioProps<T, K>>
    data: string | null
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    isNoSelect?: boolean
    disableItem?: Array<string>
    readOnly?: boolean
}

/**
 * @description Radio component
 * @param name name props
 * @param list radio list items
 * @param data check target
 * @param onChange onchange Event
 * @param isNoSelect nothing is selected
 * @param disableItem disable item
 * @constructor
 */
const Radio = <T extends string, K extends string | number>({
    name,
    list,
    data,
    onChange,
    isNoSelect = false,
    disableItem,
    readOnly = false,
}: RadioGroupProps<T, K>) => {
    return (
        <div key={name}>
            <ul className="radio-button">
                {list.map((radio, index) => (
                    <li key={radio.id}>
                        <label>
                            <input
                                type="radio"
                                name={name}
                                key={radio.id}
                                id={radio.id}
                                value={radio.value}
                                checked={isNoSelect ? false : data ? radio.id === data : index === 0}
                                onChange={onChange}
                                disabled={disableItem ? disableItem.includes(radio.id) : false}
                                readOnly={readOnly}
                            />
                            {radio.title}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Radio
