import { T_NAMESPACE } from "@/utils/resources/constants"
import React from "react"
import { useTranslation } from "react-i18next"
import { Button } from "../buttons"
import { ButtonStyleType } from "../buttons/types"

type ButtonGroupProp = {
    styleType: (typeof ButtonStyleType)[keyof typeof ButtonStyleType]
    onCancel: () => void
    onApply: () => void
    children?: JSX.Element
    border?: boolean
    disabled?: boolean
    classList?: Array<string>
    hasAuth: boolean
}

const ButtonGroup = ({
    styleType = ButtonStyleType.default,
    onCancel,
    onApply,
    children = null,
    border = false,
    disabled = false,
    classList = [],
    hasAuth = false,
}: ButtonGroupProp) => {
    const { t } = useTranslation(T_NAMESPACE.GLOBAL)
    return (
        <div className="button-group">
            {hasAuth && (
                <Button styleType={styleType} onClick={onApply} border={border} disabled={disabled} classList={classList}>
                    {children}
                </Button>
            )}

            <Button styleType={ButtonStyleType.default} onClick={onCancel}>
                {t("button.cancel")}
            </Button>
        </div>
    )
}

export default ButtonGroup
