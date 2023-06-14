import React from "react"
import { FormGroupProp, FormItemProp } from "./types"
import cx from "classnames"
import { Info, Refresh } from "@material-ui/icons"
import { useToolTip } from "@/contexts/ToolTipContext"

export const FormGroup = ({
    title = "",
    children = null,
    customClassName = [],
    required = false,
    refreshBtn = false,
    refreshEvent = () => ({}),
}: FormGroupProp) => {
    const onClick = () => {
        refreshEvent()
    }
    return (
        <div
            className={cx(
                `form-group`,
                {
                    required: required,
                },
                customClassName
            )}>
            <p className="form-group-title">
                {title}
                {refreshBtn && <Refresh className="refresh-icon" onClick={onClick} />}
            </p>
            <div className="form-group-children">{children}</div>
        </div>
    )
}

const FormItem = ({
    title = "", //폼 제목
    isDivide = false, //레이아웃 분리여부
    children = null, //하위노드
    isSplit = false, //레이아웃 분리여부
    customClassName = [], //커스텀 클래스네임
    required = false, // 필수 * 표시
    tooltip = "", // 아이콘 툴팁
    refreshBtn = false, // 새로고침 아이콘
    refreshEvent = () => ({}),
}: FormItemProp) => {
    const { setOnMouse, setOptions } = useToolTip()
    const onClick = () => {
        refreshEvent()
    }

    return (
        <div
            className={cx(
                `form-item`,
                {
                    divide: isDivide,
                    split: isSplit,
                    required: required,
                },
                customClassName
            )}>
            {!!title && (
                <p>
                    <span className="item-title">{title}</span>
                    {tooltip && (
                        <Info
                            className="info-tooltip"
                            onMouseEnter={e => {
                                setOptions({ message: tooltip, pageX: e.pageX, pageY: e.pageY })
                                setOnMouse(true)
                            }}
                            onMouseLeave={() => setOnMouse(false)}
                        />
                    )}
                    {refreshBtn && <Refresh className="refresh-icon" onClick={onClick} />}
                </p>
            )}
            <div>{children}</div>
        </div>
    )
}

export default FormItem
