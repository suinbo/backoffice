import { ToolTipProp } from "./types"
import React, { useMemo } from "react"
import cx from "classnames"
import "./styles.scss"

export const ToolTip = React.memo(({ onMouse = false, message = "", pageX = 0, pageY = 0, setOnMouse }: ToolTipProp) => {
    const moveStyle = useMemo(
        () => ({
            left: Number(pageX) + 15,
            top: Number(pageY) + 15,
        }),
        [pageX, pageY]
    )
    return (
        <div className={cx("em-tooltip", { active: onMouse })} style={moveStyle} onMouseLeave={() => setOnMouse(false)}>
            <span>{message}</span>
        </div>
    )
})

ToolTip.displayName = "ToolTip"
