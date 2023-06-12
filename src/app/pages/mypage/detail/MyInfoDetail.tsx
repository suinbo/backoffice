import React, { useCallback, useMemo, useState } from "react"
import { Button } from "@/components/ui/buttons"
import { ButtonStyleType } from "@/components/ui/buttons/types"
import { ConfirmType } from "@/components/ui/confirm/types"
import { SelectBox } from "@/components/ui/forms"
import { SelectBoxItem } from "@/components/ui/forms/types"
import { useConfirm } from "@/contexts/ConfirmContext"
import { useSession } from "@/contexts/SessionContext"
import { useValidate } from "@/hooks/useValidate"
import { autoHyphen } from "@/utils/common"
import { NUMBER, T_NAMESPACE, T_PREFIX } from "@/utils/resources/constants"
import { ValidatorProp, ValidatorType } from "@/utils/resources/validators"
import { useTranslation } from "react-i18next"
import DetailForm from "@/components/ui/forms/DetailForm"
import FormItem from "@/components/ui/forms/FormItem"
import Input from "@/components/ui/forms/Input"
import Label from "@/components/ui/forms/Label"
import { useRequest } from "@/contexts/SendApiContext"
import { API, HTTP_METHOD_PUT } from "@/utils/apis/request.const"
import { LangType, TimezoneType, UserInfoType } from "../types"
import { AxiosError } from "axios"

const langCode = "langCode"
const timeCode = "timeCode"
const defaultValue = {
    id: "", // 아이디
    name: "", // 관리자명
    phone: "", // 연락처
    email: "", // 이메일
    department: "", // 부서
    langCode: "", // 언어
    timeCode: "", // 타임존
}
const validator: Array<ValidatorProp> = [
    { key: "phone", required: true, type: ValidatorType.phone },
    { key: "email", required: true, type: ValidatorType.email },
    { key: "department", required: true, type: ValidatorType.text },
    { key: "langCode", required: true, type: ValidatorType.text },
    { key: "timeCode", required: true, type: ValidatorType.text },
]

const MyPageDetail = () => {
    const { t } = useTranslation(T_NAMESPACE.INTRO, { keyPrefix: T_PREFIX.MYPAGE })
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
    const { t: v } = useTranslation(T_NAMESPACE.VALIDATE)
    const { useFetch, useAxios } = useRequest()
    const { MAX_PHONE_LENGTH, PHONE_LENGTH } = NUMBER

    const { data: userInfo, refetch: setUserInfo } = useFetch<UserInfoType>(
        { url: API.USER_INFO },
        {
            onSuccess: (res: UserInfoType) =>
                setFormItem({
                    id: res.id,
                    name: res.name,
                    phone: res.phone,
                    email: res.email,
                    department: res.department,
                    langCode: res.langCode,
                    timeCode: res.timeCode,
                }),
        }
    )

    const [formItem, setFormItem] = useState<UserInfoType>(defaultValue)

    const { data: timezones } = useFetch<Array<TimezoneType>>({ url: API.TIMEZONE_LIST })
    const { data: languages } = useFetch<Array<LangType>>({ url: API.LANGUAGE_USE })
    const { setSession } = useSession()
    const { isValid } = useValidate<UserInfoType>(formItem)
    const { setVisible, setOptions } = useConfirm()

    /** 셀렉박스 타임존 목록  */
    const timezoneData = useMemo(() => {
        return timezones?.map(t => ({ label: t.timeName, value: t.timeCode })) ?? []
    }, [timezones])

    /** 셀렉박스 언어셋 목록 */
    const languageData = useMemo(() => {
        return languages?.map(l => ({ label: l.name, value: l.code })) ?? []
    }, [languages])

    /** 개인정보 폼 요소 변경 */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormItem(prev => ({
            ...prev,
            [id]: value,
        }))
    }

    /** 연락처 폼 하이픈 자동 입력 */
    const handlePhoneChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation()
            const { id, value } = e.target
            const setValue = value.trim().length > MAX_PHONE_LENGTH ? value.replace(/[^0-9]/g, "").substring(0, PHONE_LENGTH) : value
            setFormItem(prev => ({ ...prev, [id]: autoHyphen(setValue) }))
        },
        [formItem]
    )

    /** 셀렉박스 변경 */
    const onSelectBoxChange = useCallback(
        (id: string, item: SelectBoxItem) => {
            const { value } = item
            setFormItem(prev => ({
                ...prev,
                [id]: value,
            }))
        },
        [userInfo]
    )

    /**
     * 로컬스토리지 타임벨류 세팅
     */
    const findTimeValue = useMemo(() => {
        return timezones?.find(i => i.timeCode == formItem.timeCode)?.timeValue
    }, [formItem, timezones])

    /** 수정 버튼 이벤트 */
    const modify = useCallback(() => {
        isValid(validator, (valid, errors) => {
            if (valid) {
                setOptions({
                    type: ConfirmType.success,
                    message: `${g("confirm.onSave")}\n${g("confirm.onSaveForce")}`,
                    buttonStyle: ButtonStyleType.primary,
                    applyButtonMessage: g("button.save"),
                    onApply: () => {
                        const param = {
                            phone: encodeURIComponent(formItem.phone),
                            email: encodeURIComponent(formItem.email),
                            department: formItem.department,
                            setLangCd: formItem.langCode ?? "",
                            setTimeZone: formItem.timeCode ?? "",
                        }
                        useAxios(
                            {
                                url: API.USER_INFO,
                                param: { ...param },
                                method: HTTP_METHOD_PUT,
                            },
                            () => {
                                setUserInfo()
                                setSession({ timeZoneData: findTimeValue, languageCode: formItem.langCode ?? "" })
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
    }, [formItem, userInfo, findTimeValue])

    const defaultLangItem = useMemo(() => {
        return !!userInfo && languageData.find(lang => lang.value === userInfo.langCode)
    }, [userInfo, languageData])

    const defaultTimeItem = useMemo(() => {
        return !!userInfo && timezoneData.find(tz => tz.value === userInfo.timeCode)
    }, [userInfo, timezoneData])

    return (
        <DetailForm>
            <div className="body-title"> {t("detailContents")} </div>
            <FormItem isDivide={true} required={true}>
                <Label id="id" value={t("id")} />
                <Input id="id" type="text" readonly={true} value={formItem.id} />
            </FormItem>
            <FormItem isDivide={true} required={true}>
                <Label id="name" value={t("name")} />
                <Input id="name" type="text" readonly={true} value={formItem.name} />
            </FormItem>
            <FormItem isDivide={true} required={true}>
                <Label id="phone" value={t("phone")} />
                <Input id="phone" type="text" value={formItem.phone} onChange={handlePhoneChange} />
            </FormItem>
            <FormItem isDivide={true} required={true}>
                <Label id="email" value={t("email")} />
                <Input id="email" type="text" value={formItem.email} onChange={handleChange} />
            </FormItem>
            <FormItem required={true}>
                <Label id="department" value={t("department")} />
                <Input id="department" type="text" value={formItem.department} onChange={handleChange} />
            </FormItem>
            <div className="select-setting">
                <FormItem isDivide={true} required={true}>
                    <Label id="language" value={t("language")} />
                    <SelectBox
                        defaultLabel={t("chooseLanguage")}
                        defaultItem={defaultLangItem}
                        items={languageData}
                        onChange={item => onSelectBoxChange(langCode, item)}
                    />
                </FormItem>
                <FormItem isDivide={true} required={true}>
                    <Label id="timezone" value={t("timezone")} />
                    <SelectBox
                        defaultLabel={t("chooseTimezone")}
                        defaultItem={defaultTimeItem}
                        items={timezoneData}
                        onChange={item => onSelectBoxChange(timeCode, item)}
                    />
                </FormItem>
            </div>
            <div className="button-group">
                <Button onClick={modify} styleType={ButtonStyleType.primary}>
                    {g("button.save")}
                </Button>
            </div>
        </DetailForm>
    )
}

export default React.memo(MyPageDetail)
