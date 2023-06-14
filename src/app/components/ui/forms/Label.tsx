import React from "react"

type LabelProps = {
    value?: string
    id: string
    children?: React.ReactChild | Array<React.ReactChild>
}

const Label = ({ value = "", id = "", children }: LabelProps) => {
    return (
        <label htmlFor={id}>
            {value}
            {children}
        </label>
    )
}

export default React.memo(Label)
