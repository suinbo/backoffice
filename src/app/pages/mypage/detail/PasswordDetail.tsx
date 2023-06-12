import React, { useState } from "react"
import { Button } from "@/components/ui/buttons"
import { ButtonStyleType } from "@/components/ui/buttons/types"
import { ConfirmType } from "@/components/ui/confirm/types"
import { useConfirm } from "@/contexts/ConfirmContext"
import { useValidate } from "@/hooks/useValidate"
import { T_NAMESPACE, T_PREFIX } from "@/utils/resources/constants"
import { isInValidPassword, ValidatorProp, ValidatorType } from "@/utils/resources/validators"
import { LockOutlined } from "@material-ui/icons"
import { useTranslation } from "react-i18next"
import { Storage } from "@/utils/storage"
import DetailForm from "@/components/ui/forms/DetailForm"
import FormItem from "@/components/ui/forms/FormItem"
import Input from "@/components/ui/forms/Input"
import Label from "@/components/ui/forms/Label"
import { useRequest } from "@/contexts/SendApiContext"
import { API, HTTP_METHOD_PUT } from "@/utils/apis/request.const"
import { passwordType } from "../types"
import { AxiosError } from "axios"

const defaultValue = {
    secretPw: "", // 현재 비밀번호
    setSecretPw: "", // 새 비밀번호
    checkSecretPw: "", // 새 비밀번호 확인
    accessId: "", // 아이디
}

const validator: Array<ValidatorProp> = [
    {
        key: "secretPw",
        required: true,
        type: ValidatorType.text,
    },
    {
        key: "checkSecretPw",
        required: true,
        type: ValidatorType.password,
        fn: (checkSecretPw, formItem: passwordType) => (checkSecretPw === formItem.setSecretPw ? null : "mismatchPassword"),
    },
    {
        key: "setSecretPw",
        required: true,
        type: ValidatorType.password,
        fn: (value: string, formItem: passwordType) => isInValidPassword({ password: value, id: formItem.accessId }),
    },
]

const Password = () => {
    const { t } = useTranslation(T_NAMESPACE.INTRO, { keyPrefix: T_PREFIX.MYPAGE })
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
    const { t: v } = useTranslation(T_NAMESPACE.VALIDATE)
    const [formItem, setFormItem] = useState<passwordType>({ ...defaultValue, accessId: Storage.get(Storage.keys.loginId) })
    const { isValid } = useValidate<passwordType>(formItem)
    const { setVisible, setOptions } = useConfirm()
    const { useAxios } = useRequest()

    /** 개인정보 폼 요소 변경 */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormItem(prev => ({
            ...prev,
            [id]: value,
        }))
    }

    const onSave = () => {
        isValid(validator, (valid, errors) => {
            if (valid) {
                setOptions({
                    type: ConfirmType.success,
                    message: g("confirm.onSave"),
                    buttonStyle: ButtonStyleType.primary,
                    applyButtonMessage: g("button.save"),
                    onApply: () => {
                        const param = {
                            secretPw: encodeURIComponent(formItem.secretPw ?? ""),
                            setSecretPw: encodeURIComponent(formItem.setSecretPw ?? ""),
                        }
                        useAxios(
                            {
                                url: API.USER_PASSWORD,
                                param: { ...param },
                                method: HTTP_METHOD_PUT,
                            },
                            () => {
                                setOptions({
                                    type: ConfirmType.alert,
                                    message: t("pwChangedSuccess"),
                                    buttonStyle: ButtonStyleType.default,
                                    applyButtonMessage: g("button.ok"),
                                })
                                setVisible(true)
                                setFormItem(defaultValue)
                            },
                            (err: AxiosError) => {
                                setOptions({
                                    type: ConfirmType.alert,
                                    message: err.message,
                                    buttonStyle: ButtonStyleType.default,
                                    applyButtonMessage: g("button.ok"),
                                })
                                setVisible(true)
                            }
                        )
                    },
                })
                setVisible(true)
            } else {
                setOptions({
                    type: ConfirmType.alert,
                    message: v(`userInfo.${errors[0].key}`, { val: v(errors[0].message) }),
                    buttonStyle: ButtonStyleType.default,
                    applyButtonMessage: g("button.ok"),
                })
                setVisible(true)
            }
        })
    }

    return (
        <DetailForm>
            <div>
                <div className="sub-title">
                    <LockOutlined className="sub-icon" />
                    <p>{t("changePassword")}</p>
                </div>
                <p className="sub-description">{t("passwordDescription")}</p>
            </div>
            <FormItem required={true}>
                <Label id="password" value={t("curPassword")} />
                <Input id="secretPw" type="password" onChange={handleChange} value={formItem.secretPw} />
            </FormItem>
            <FormItem isDivide={true} required={true}>
                <Label id="newPW" value={t("newPassword")} />
                <Input id="setSecretPw" type="password" onChange={handleChange} value={formItem.setSecretPw} />
            </FormItem>
            <FormItem isDivide={true} required={true}>
                <Label id="newPWCheck" value={t("confirmNewPassword")} />
                <Input id="checkSecretPw" type="password" onChange={handleChange} value={formItem.checkSecretPw} />
            </FormItem>
            <div className="button-group">
                <Button onClick={onSave} styleType={ButtonStyleType.primary}>
                    {g("button.save")}
                </Button>
            </div>
        </DetailForm>
    )
}

export default React.memo(Password)
