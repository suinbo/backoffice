import React from "react"
import cx from "classnames"

type InputProps = {
    value?: string | number
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    type?: string
    readonly?: boolean
    placeholder?: string
    id?: string
    name?: string
    onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    required?: boolean
    multiple?: boolean
    onBlur?: () => void
    onFocus?: () => void
    defaultValue?: string
    customClassName?: Array<string> //커스텀 클래스네임
    autoFocus?: boolean
    refProps?: { inputRef: React.MutableRefObject<HTMLInputElement | null> }
    disabled?: boolean
}

const Input = ({
    value,
    onChange,
    type = "",
    readonly = false,
    placeholder = "",
    id = "",
    name = "",
    onKeyUp,
    onKeyDown,
    required = false,
    multiple = false,
    onBlur,
    onFocus,
    defaultValue,
    customClassName = [], //커스텀 클래스네임
    autoFocus = false,
    refProps,
    disabled = false,
}: InputProps) => {
    return (
        <input
            id={id}
            name={name}
            type={type}
            onChange={onChange}
            defaultValue={defaultValue}
            value={value}
            placeholder={placeholder}
            readOnly={readonly}
            onKeyUp={onKeyUp}
            onKeyDown={onKeyDown}
            required={required}
            multiple={multiple}
            onBlur={onBlur}
            onFocus={onFocus}
            className={cx(customClassName)}
            autoFocus={autoFocus}
            onClick={e => e.stopPropagation()}
            ref={refProps?.inputRef}
            disabled={disabled}
        />
    )
}

export default React.memo(Input)
