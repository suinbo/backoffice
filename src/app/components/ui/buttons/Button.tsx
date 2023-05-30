import React, { forwardRef } from "react"
import cx from "classnames"
import { ButtonProp, ButtonStyleType } from "./types"
import "./styles.scss"

const Button = forwardRef<HTMLButtonElement, ButtonProp>(
    (
        {
            onClick,
            children = null,
            styleType = ButtonStyleType.default,
            border = false,
            disabled = false,
            classList = [],
            type = "submit",
        }: // hasEditAuth = false,
        ButtonProp,
        ref
    ) => {
        /** Click event */
        const handelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            onClick(e)
        }

        return (
            <>
                <button
                    ref={ref}
                    type={type}
                    disabled={disabled}
                    className={cx("em-button", { border: border }, styleType, classList)}
                    onClick={handelClick}>
                    {children}
                </button>
            </>
        )
    }
)

Button.displayName = "Button"

export default Button
