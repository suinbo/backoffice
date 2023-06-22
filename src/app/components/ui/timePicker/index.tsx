import React, { forwardRef, useCallback, useEffect, useMemo, useState } from "react"
import { DATE_FORMAT_LINE, T_NAMESPACE } from "@/utils/resources/constants"
import { useTranslation } from "react-i18next"
import { Selectbox } from "../forms"
import { hourList, msList, TIME } from "./constant"
import { convert2Utc, convertDateTime2Unix } from "@/utils/common"
import { useConfirm } from "@/contexts/ConfirmContext"
import { ConfirmType } from "../confirm/types"
import { ButtonStyleType } from "../buttons/types"
import { SelectBoxItem } from "../forms/types"
import "./styles.scss"

export type TimeValidProp = {
    startDateTime?: number
    endDateTime?: number
    maxDateTime?: number
    minDateTime?: number
}

export interface timePickerProps {
    format?: string
    defaultValue?: string
    isSecond?: boolean
    setTime: (time: string) => void
    disabled?: boolean
    validItem?: TimeValidProp
}

const defaultValidDate: TimeValidProp = {
    startDateTime: null,
    maxDateTime: null,
    endDateTime: null,
    minDateTime: null,
}

/**
 * @prop defaultValue: (시:분:초) 초기 값
 * @prop isSecond: '초'의 표기 여부
 * @prop validItem: 비교할 시작, 종료 날짜/시간 값 (unix time)
 */
const SelectTimePicker = forwardRef<HTMLDivElement, timePickerProps>(
    ({ defaultValue = "00:00:00", isSecond = true, setTime, disabled = false, validItem }: timePickerProps, ref) => {
        const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
        const { t: v } = useTranslation(T_NAMESPACE.VALIDATE)
        const { setVisible, setOptions } = useConfirm()

        const [[hour, minute, second], setState] = useState<Array<string>>(
            defaultValue ? defaultValue.split(":") : [g("label.select"), g("label.select"), g("label.select")]
        )
        const hourItem = useMemo(() => hourList.map(value => ({ value })), [])
        const msItem = useMemo(() => msList.map(value => ({ value })), [])

        useEffect(() => setState(defaultValue ? defaultValue.split(":") : [g("label.select"), g("label.select"), g("label.select")]), [defaultValue])
        useEffect(() => setTime(`${hour}:${minute}:${second}`), [hour, minute, second])

        /** 셀렉박스 선택 */
        const onChange = useCallback(
            (item: SelectBoxItem, key: number) => {
                const { startDateTime, maxDateTime, endDateTime, minDateTime } = validItem ?? defaultValidDate
                const initSec = isSecond ? second : "00"

                const dtFormat = {
                    [TIME.HOUR]: {
                        format: `${item.value}:${minute}:${initSec}`,
                        arr: [item.value, minute, initSec],
                    },
                    [TIME.MIN]: {
                        format: `${hour}:${item.value}:${initSec}`,
                        arr: [hour, item.value, initSec],
                    },
                    [TIME.SEC]: {
                        format: `${hour}:${minute}:${item.value}`,
                        arr: [hour, minute, item.value],
                    },
                }

                const getTime = (time: number) => convertDateTime2Unix(`${convert2Utc(time, DATE_FORMAT_LINE)} ${dtFormat[key].format}`)

                //일시 유효성 검사
                if (validItem && (getTime(startDateTime) >= maxDateTime || getTime(endDateTime) <= minDateTime)) {
                    setOptions({
                        type: ConfirmType.alert,
                        message: v("isExceedEndDate"),
                        buttonStyle: ButtonStyleType.default,
                        applyButtonMessage: g("button.ok"),
                    })
                    setVisible(true)
                } else {
                    setState(() => dtFormat[key].arr)
                }
            },
            [hour, minute, second, validItem]
        )

        return (
            <div className={`em-timepicker-wrapper ${disabled ? "disabled" : ""}`}>
                <div>
                    <Selectbox
                        isEdit={true}
                        items={hourItem}
                        defaultItem={{ value: hour }}
                        onChange={item => onChange(item, TIME.HOUR)}
                        ref={ref}
                        disabled={disabled}
                    />
                    <span>{g("label.hour")}</span>
                </div>
                <div>
                    <Selectbox
                        isEdit={true}
                        items={msItem}
                        defaultItem={{ value: minute }}
                        onChange={item => onChange(item, TIME.MIN)}
                        ref={ref}
                        disabled={disabled}
                    />
                    <span>{g("label.minute")}</span>
                </div>
                {isSecond && (
                    <div>
                        <Selectbox
                            isEdit={true}
                            items={msItem}
                            defaultItem={{ value: second }}
                            onChange={item => onChange(item, TIME.SEC)}
                            ref={ref}
                            disabled={disabled}
                        />
                        <span>{g("label.second")}</span>
                    </div>
                )}
            </div>
        )
    }
)

SelectTimePicker.displayName = "SelectTimePicker"
export default React.memo(SelectTimePicker)
