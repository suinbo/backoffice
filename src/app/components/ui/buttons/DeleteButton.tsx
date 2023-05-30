import { T_NAMESPACE } from "@/utils/resources/constants"
import React, { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useConfirm } from "@/contexts/ConfirmContext"
import { ConfirmType } from "../confirm/types"
import { Button } from "@/components/ui/buttons"
import { ButtonStyleType, DeleteButtonProp, DeleteButtonType, DeleteEvent } from "./types"
import { BlockOutlined, Delete, DeleteRounded } from "@material-ui/icons"
import cx from "classnames"

const defaultProp = {
    disabled: false,
    styleType: ButtonStyleType.danger,
    classList: [""],
}

const DeleteButton = ({ onClick, buttonProp = null, type = DeleteButtonType.Button, alertMsg }: DeleteButtonProp) => {
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
    const { setVisible, setOptions } = useConfirm()
    const prop = { ...defaultProp, ...buttonProp }

    const confirmDelete = useCallback(() => {
        const rejectType = type == DeleteButtonType.Reject
        const delTitle = rejectType ? g("label.reject") : g("label.delete")
        const delMsg = rejectType ? g("confirm.onReject") : g("confirm.onDelete")
        const btnMsg = rejectType ? g("button.reject") : g("button.delete")

        setOptions({
            type: ConfirmType.danger,
            title: delTitle,
            message: alertMsg ?? delMsg,
            buttonStyle: ButtonStyleType.danger,
            applyButtonMessage: btnMsg,
            onApply: onClick && onClick,
        })
        setVisible(true)
    }, [type, onClick])

    /** Click event */
    const handelClick = useCallback(
        (e: DeleteEvent) => {
            e.stopPropagation()
            if (!prop.disabled) confirmDelete()
        },
        [confirmDelete]
    )
    // (e: DeleteEvent) => {
    //     e.stopPropagation()
    //     if (!prop.disabled) confirmDelete()
    // }

    const DeleteButton = useMemo(() => {
        switch (type) {
            case DeleteButtonType.DeleteRounded:
                return (
                    <DeleteRounded
                        className={cx("delete", prop.classList, { disabled: prop.disabled })}
                        onClick={e => {
                            handelClick(e)
                        }}
                    />
                )
            case DeleteButtonType.Reject:
                return (
                    <Button {...prop} styleType={ButtonStyleType.danger} onClick={e => handelClick(e)}>
                        <BlockOutlined className="icon reject" />
                        {g("button.reject")}
                    </Button>
                )
            case DeleteButtonType.Button:
            default:
                return (
                    <Button {...prop} styleType={ButtonStyleType.danger} onClick={e => handelClick(e)}>
                        <Delete className="icon del" />
                        {g("button.delete")}
                    </Button>
                )
        }
    }, [type, handelClick])

    return <>{DeleteButton}</>
}

export default DeleteButton
