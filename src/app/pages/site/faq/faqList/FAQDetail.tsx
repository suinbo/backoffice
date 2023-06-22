import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { BorderColor, Close } from "@material-ui/icons"
import { Button, DeleteButton } from "@/components/ui/buttons"
import { ButtonStyleType, DeleteButtonType } from "@/components/ui/buttons/types"
import { useTranslation } from "react-i18next"
import { useValidate } from "@/hooks/useValidate"
import { ValidatorProp, ValidatorType } from "@/utils/resources/validators"
import { ConfirmType } from "@/components/ui/confirm/types"
import { useConfirm } from "@/contexts/ConfirmContext"
import { DATE_FORMAT_LINE, FLAG, MENUS, VIEW_CODES, T_NAMESPACE } from "@/utils/resources/constants"
import { changeSystemCodeFormat, convertDateTime2Unix, onChangeDateForm } from "@/utils/common"
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { API, HTTP_METHOD_DELETE, HTTP_METHOD_POST, HTTP_METHOD_PUT } from "@/utils/apis/request.const"
import Editor from "@/components/ui/editor"
import SelectBox from "@/components/ui/forms/SelectBox"
import CheckBoxList from "@/components/ui/forms/CheckList"
import Radio from "@/components/ui/forms/Radio"
import FormItem from "@/components/ui/forms/FormItem"
import Input from "@/components/ui/forms/Input"
import dayjs from "dayjs"
import CustomDatePicker from "@/components/ui/datePicker"
import SelectTimePicker from "@/components/ui/timePicker"
import { useRequest } from "@/contexts/SendApiContext"
import { applyPath } from "@/utils/apis/request"
import { SelectBoxItem } from "@/components/ui/forms/types"
import { FAQDetailProp, InitialState } from "./types"
import { PageCodeList, POCListProp, TimeType } from "@/utils/apis/request.types"
import { AxiosError } from "axios"

const defaultValue: FAQDetailProp = {
    title: "",
    categoryCd: "",
    // topYn: false,
    viewDt: 0,
    viewYn: true,
    realtimeYn: false,
    pocList: [],
    content: "",
}

const defaultTime: TimeType = {
    date: new Date(),
    time: "00:00:00",
}

const validator: Array<ValidatorProp> = [
    { key: "categoryCd", required: true, type: ValidatorType.text },
    { key: "title", required: true, type: ValidatorType.text },
    {
        key: "pocList",
        required: true,
        type: ValidatorType.text,
        fn: (pocList: Array<POCListProp>) => (pocList.length > 0 ? null : "inValidRequired"),
    },
    {
        key: "content",
        required: true,
    },
]

/**
 * 노출일자 여부
 */
const enableBlindDateTime = FLAG.Y

const initialState: InitialState = {
    defaultDateTime: {
        date: new Date(),
        time: "00:00:00",
    },
    blindDateTime: {
        date: new Date(),
        time: "00:00:00",
    },
    checkedBlindDate: [],
}

const FAQModal = () => {
    // 시스템 아이디
    const { noId } = useParams()
    const [queryParam] = useSearchParams()
    const { state } = useLocation()
    const navigate = useNavigate()
    const systemId = useMemo(() => noId || queryParam.get("cd"), [queryParam])
    const editorRef = useRef<any>(null)
    const blindElementRef = useRef<HTMLDivElement>(null)

    const { t } = useTranslation(T_NAMESPACE.FAQ)
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
    const { t: v } = useTranslation(T_NAMESPACE.VALIDATE)
    const { setVisible, setOptions } = useConfirm()
    const { useAxios, useFetch } = useRequest()

    const [active, setActive] = useState(false)
    const [formItem, setFormItem] = useState<FAQDetailProp>({ ...defaultValue })
    const [showBlindDateArea, setShowBlindDateArea] = useState(false)
    const [checkedPocCodes, setCheckedPocCodes] = useState<Array<string>>([])
    const [{ defaultDateTime, blindDateTime, checkedBlindDate }, setDateTime] = useState(initialState)

    const { data: result } = useFetch<FAQDetailProp>(systemId ? { url: applyPath(API.FAQ_DETAIL, systemId) } : null)

    const { isValid } = useValidate<FAQDetailProp>(formItem)

    /** 운영 코드 조회 */
    useFetch<Array<PageCodeList>>(
        { url: `${API.OPCODE_LIST}/${VIEW_CODES.FAQ}/list` },
        {
            onSuccess: (res: Array<PageCodeList>) => {
                const getSearchItem = changeSystemCodeFormat(res, "search")
            },
        }
    )

    const blindDefaultCheckItems = useMemo(() => [{ label: g("label.reserve"), value: enableBlindDateTime }], [])
    const blindItems = useMemo(
        () => [
            { id: "blind_item_enable", title: g("label.viewY"), value: 1 },
            { id: "blind_item_disable", title: g("label.viewN"), value: 0 },
        ],
        []
    )

    useEffect(() => {
        setActive(false)
        sendFormItem()
    }, [active])

    useEffect(() => {
        if (result) {
            const { viewDt, realtimeYn, pocList } = result
            setFormItem(result)
            setShowBlindDateArea(realtimeYn)
            setDateTime({
                checkedBlindDate: realtimeYn ? [enableBlindDateTime] : [],
                defaultDateTime: onChangeDateForm(viewDt ? viewDt : dayjs().startOf("day").unix()),
                blindDateTime: onChangeDateForm(viewDt ? viewDt : dayjs().startOf("day").unix()),
            })
            setCheckedPocCodes(pocList.map(poc => poc.code))
        }
    }, [result])

    useLayoutEffect(() => {
        if (formItem.viewYn && blindElementRef.current) {
            blindElementRef.current.scrollIntoView()
        }
    }, [formItem.viewYn, blindElementRef])

    // onChange Category selectBox
    const onChangeCategory = useCallback(
        (category: SelectBoxItem) => {
            const categoryCd = category.value
            if (formItem.categoryCd !== categoryCd) {
                setFormItem(prev => ({ ...prev, categoryCd, pocList: [] }))
                setCheckedPocCodes([])
            }
        },
        [formItem]
    )

    // onChange Radio
    const onChangeText = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { id, value } = e.target
            setFormItem(prev => ({ ...prev, [id]: value }))
        },
        [formItem]
    )

    // onChange Radio
    const onChangeRadio = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
            const value = parseInt(e.target.value) === 1
            const isKeyOfViewYN = key === "viewYn"
            setFormItem(prev => {
                const state = { ...prev, [key]: value }
                if (isKeyOfViewYN) state.realtimeYn = false
                return state
            })
            if (isKeyOfViewYN) {
                setDateTime(prev => ({
                    ...prev,
                    blindDateTime: value ? { ...defaultTime } : { ...defaultDateTime },
                    checkedBlindDate: [],
                }))
                !value && setShowBlindDateArea(false)
            }
        },
        [formItem]
    )

    // onChange POC selectBox and textarea
    const onChangePoc = useCallback(
        (pocCheckList: Array<string>) => {
            const pocList = pocCheckList.map(poc => ({
                code: poc,
            }))
            setFormItem(prev => ({
                ...prev,
                pocList,
            }))
        },
        [checkedPocCodes, formItem]
    )

    // Click RealtimeYn radio
    const OnCheckBlindDate = useCallback(
        (view: Array<string>) => {
            const realtimeYn = view.includes(enableBlindDateTime)
            setShowBlindDateArea(realtimeYn)
            setFormItem(prev => ({ ...prev, realtimeYn }))
        },
        [showBlindDateArea]
    )

    // hide Modal
    const onCancel = useCallback(() => {
        navigate(MENUS.FAQ, { state: state })
    }, [])

    // Save API
    const sendFormItem = useCallback(() => {
        if (active) {
            isValid(validator, (valid, errors) => {
                if (valid) {
                    setOptions({
                        type: ConfirmType.success,
                        message: g("confirm.onSave"),
                        buttonStyle: ButtonStyleType.primary,
                        applyButtonMessage: g("button.save"),
                        onApply: () => {
                            useAxios(
                                {
                                    url: systemId ? applyPath(API.FAQ_DETAIL, systemId) : API.FAQ_DETAIL,
                                    param: { ...formItem },
                                    method: systemId ? HTTP_METHOD_PUT : HTTP_METHOD_POST,
                                },
                                onCancel,
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
                        message: v(`faq.${errors[0].key}`, { val: v(errors[0].message) }),
                        buttonStyle: ButtonStyleType.default,
                        applyButtonMessage: g("button.ok"),
                    })
                    setVisible(true)
                }
            })
        }
    }, [active, blindDateTime, formItem])

    // Save API
    const saveForm = useCallback(() => {
        setActive(true)
        setFormItem(prev => {
            const pocList = prev.pocList.map(poc => ({
                code: poc.code,
            }))
            return {
                ...prev,
                pocList,
                viewDt: formItem.realtimeYn
                    ? convertDateTime2Unix(`${dayjs(blindDateTime.date).format(DATE_FORMAT_LINE)} ${blindDateTime.time}`)
                    : convertDateTime2Unix(new Date()),
                content: editorRef.current.editor.getData() || "",
                // viewDt: prev.viewYn
                //     ? showBlindDateArea
                //         ? (convertDateTime2Unix(`${dayjs(blindDateTime.date).format(DATE_FORMAT_LINE)} ${blindDateTime.time}`))
                //         : dayjs().startOf('day').unix()
                //     : 0,
            }
        })
    }, [formItem, blindDateTime])

    // Delete API
    const onDelete = useCallback(() => {
        useAxios(
            {
                url: applyPath(API.FAQ_DETAIL, systemId),
                method: HTTP_METHOD_DELETE,
            },
            onCancel,
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
    }, [systemId])

    // Modal Header
    const HeaderRenderer = useCallback(() => {
        return (
            <div className="page-detail-title">
                <h2>
                    <BorderColor className="modal-title-icon writing-icon" />
                    {t(`${systemId ? "faqDetails" : "faqRegist"}`)}
                </h2>
                <Close className="close" onClick={onCancel} />
            </div>
        )
    }, [systemId])

    // Modal Footer
    const FooterRenderer = useCallback(() => {
        return (
            <div className="button-group">
                <Button styleType={ButtonStyleType.primary} onClick={saveForm}>
                    {systemId ? g("button.modify") : g("button.save")}
                </Button>
                <Button styleType={ButtonStyleType.default} onClick={onCancel}>
                    {g("button.cancel")}
                </Button>
            </div>
        )
    }, [systemId, formItem, saveForm])

    // 노출일자 설정
    const viewDateForm = useMemo(() => {
        return (
            showBlindDateArea && (
                <div className="view-date">
                    <CustomDatePicker
                        date={blindDateTime.date}
                        onChange={(date: Date) =>
                            setDateTime(prev => ({
                                ...prev,
                                blindDateTime: {
                                    date: date,
                                    time: prev.blindDateTime.time,
                                },
                            }))
                        }
                    />
                    <SelectTimePicker
                        setTime={(time: string) =>
                            setDateTime(prev => ({
                                ...prev,
                                blindDateTime: {
                                    date: prev.blindDateTime.date,
                                    time: time,
                                },
                            }))
                        }
                        defaultValue={blindDateTime.time}
                    />
                </div>
            )
        )
    }, [showBlindDateArea, blindDateTime])

    const titleWrapper = useMemo(
        () => (
            <>
                <h4>{g(systemId ? "editPost" : "registPost")}</h4>
                {!!systemId && <DeleteButton type={DeleteButtonType.Button} buttonProp={{ border: true }} onClick={onDelete} />}
            </>
        ),
        [systemId]
    )

    return (
        <div className="page-detail">
            <HeaderRenderer />
            <div className="detail-title">{titleWrapper}</div>
            <div className="detail-area">
                <FormItem title={t("category")} required={true} customClassName={["view-read-cnt"]}>
                    <SelectBox classList={["long-select-box"]} items={[]} onChange={onChangeCategory} />
                    {!!systemId && (
                        <div className="read-cnt-area">
                            <span className="read-cnt-title">{t("readCount")}</span>
                            <span className="read-cnt">{formItem.readCnt}</span>
                        </div>
                    )}
                </FormItem>
                <FormItem title={t("title")} required={true}>
                    <Input id="title" type="text" onChange={onChangeText} value={formItem.title} />
                </FormItem>
                <FormItem title={"POC"} required={true}>
                    <CheckBoxList allChecked={true} checkBoxItems={[]} checkedItems={checkedPocCodes} onChange={onChangePoc} />
                </FormItem>
                <FormItem required={true} title={`${t("contents")}`}>
                    <Editor type="edit" content={formItem.content || ""} ref={editorRef} />
                </FormItem>
                <FormItem title={t("viewYn")}>
                    <Radio
                        key="faqViewYn"
                        name="faqViewYn"
                        list={blindItems}
                        data={formItem.viewYn ? blindItems[0].id : blindItems[1].id}
                        onChange={e => onChangeRadio(e, "viewYn")}
                    />
                </FormItem>
                {formItem.viewYn && (
                    <FormItem title={t("viewDate")} customClassName={["view-setting"]}>
                        <div className="setting-checkbox" ref={blindElementRef}>
                            <CheckBoxList checkBoxItems={blindDefaultCheckItems} checkedItems={checkedBlindDate} onChange={OnCheckBlindDate} />
                        </div>
                        {viewDateForm}
                    </FormItem>
                )}
                <FooterRenderer />
            </div>
        </div>
    )
}

export default FAQModal
