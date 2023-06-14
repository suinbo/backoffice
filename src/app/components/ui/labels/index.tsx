import React from "react"
import { LabelsProps, LabelStyleType } from "./type"
import { Alarm, Cancel, CheckCircle } from "@material-ui/icons"

const Labels: React.FC<LabelsProps> = ({ children, styleType }) => {
    const Icon = () => {
        switch (styleType) {
            case LabelStyleType.success:
                return <CheckCircle />
            case LabelStyleType.danger:
                return <Cancel />
            case LabelStyleType.reservation:
            default:
                return <Alarm />
        }
    }

    return (
        <span className={`state ${styleType}`}>
            <Icon />
            <span>{children}</span>
        </span>
    )
}

export default React.memo(Labels)
