import React, { useEffect, useMemo, useRef } from "react"
import { ConfirmProp, ConfirmType, ConfirmTypeKey } from "./types"
import { Done, InfoOutlined, NotificationImportant, WarningOutlined } from "@material-ui/icons"
import { Button } from "../buttons"
import { ButtonStyleType } from "@/components/ui/buttons/types"
import { useTranslation } from "react-i18next"
import { T_NAMESPACE } from "@/utils/resources/constants"
import cx from "classnames"
import "./styles.scss"

type ConfirmProps = {
    [key in ConfirmTypeKey]?: JSX.Element
}

export const Confirm = ({
    type = ConfirmType.alert,
    visible = false,
    setVisible,
    message = null,
    buttonStyle = ButtonStyleType.default,
    applyButtonMessage = "",
    onApply,
    onClose,
}: ConfirmProp) => {
    const { t: g, i18n } = useTranslation(T_NAMESPACE.GLOBAL)
    const focusRef = useRef<HTMLButtonElement>(null)

    const ConfirmIcons = useMemo<ConfirmProps>(
        () => ({
            info: <InfoOutlined className="icon info" />,
            warning: <WarningOutlined className="icon warning" />,
            success: <Done className="icon success" />,
            danger: <NotificationImportant className="icon danger" />,
            alert: <span>{g("label.alert")}</span>,
        }),
        [i18n.language]
    )

    // 컨펌창 나타낫을때 백그라운드 스크롤 막기
    useEffect(() => {
        if (!!document.querySelector(".modal") || visible) {
            document.body.style.overflow = "hidden"
            focusRef.current.focus()
        } else document.body.style.overflow = "auto"
    }, [visible])

    return (
        <div className={cx("em-confirm", { show: visible }, type)}>
            <div className="em-confirm-wrapper">
                <div className="em-confirm-header">{ConfirmIcons[type]}</div>
                <div className="em-confirm-body">
                    <p> {message} </p>
                </div>
                <div className="em-confirm-footer">
                    <Button
                        ref={focusRef}
                        styleType={buttonStyle}
                        onClick={() => {
                            setVisible(false)
                            !!onApply && onApply()
                        }}>
                        {applyButtonMessage}
                    </Button>
                    {type !== ConfirmType.alert && (
                        <Button
                            styleType={ButtonStyleType.default}
                            onClick={() => {
                                setVisible(false)
                                !!onClose && onClose()
                            }}>
                            {g("button.cancel")}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
