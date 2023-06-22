import React from "react"

type TextAreaProps = {
    value?: string | number
    onChangeArea?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    type?: string
    readonly?: boolean
    placeholder?: string
    id?: string
}

const TextArea = ({ value = "", onChangeArea, readonly = false, placeholder = "", id = "" }: TextAreaProps) => {
    return <textarea id={id} onChange={onChangeArea} value={value} placeholder={placeholder} readOnly={readonly} />
}

export default React.memo(TextArea)
