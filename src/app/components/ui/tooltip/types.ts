import React from 'react'

/** ToolTip */
export type ToolTipProp = {
    onMouse: boolean
    message: string
    pageX: number
    pageY: number
    setOnMouse: React.Dispatch<React.SetStateAction<boolean>>
}
