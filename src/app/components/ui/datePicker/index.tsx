import React, { forwardRef, useCallback, useEffect, useRef, useState } from "react"
import { TIME_HMS_FORMAT, DATE_FORMAT_LINE, DATE_PICKER_FORMAT, T_NAMESPACE, TIME_HMS_START, TIME_HMS_END } from "@/utils/resources/constants"
import { DateRange } from "@material-ui/icons"
import { autoDayType, convert2Utc, convertDateTime2Unix, onChangeDateForm } from "@/utils/common"
import { isValidDate, isValidDay, isValidMonth, isValidYear } from "@/utils/resources/validators"
import DatePicker from "react-datepicker"
import dayjs from "dayjs"
import { useConfirm } from "@/contexts/ConfirmContext"
import { ConfirmType } from "../confirm/types"
import { ButtonStyleType } from "../buttons/types"
import { useTranslation } from "react-i18next"
import { DatePickerProp } from "./types"
import "./styles.scss"

/**
 * @prop date: 선택된 날짜
 * @prop onChange: 날짜 변경 이벤트 핸들러
 * @prop isOnlyDate: DatePicker 만 사용하는 경우 (true), DatePicker + TimePicekr 사용하는 경우 (false)
 * @prop validItem: 비교할 시작, 종료 날짜/시간 값 (unix time)
 */
const CustomDatePicker = ({ date, onChange, readOnly = false, disabled = false, isOnlyDate = true, validItem }: DatePickerProp) => {
    const refs = useRef(null)
    const [focus, setFocus] = useState(false)
    const [open, setOpen] = useState<boolean>(false)
    const [dateFormat, setDateFormat] = useState<string>()

    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
    const { t: v } = useTranslation(T_NAMESPACE.VALIDATE)
    const { setVisible, setOptions } = useConfirm()

    /** 일시 유효성 검사 */
    const isValid = useCallback(
        (selectedDate: Date | string) => {
            const { startDateTime, maxDateTime, endDateTime, minDateTime } = validItem

            const getDate = (dateTime: number) =>
                convertDateTime2Unix(
                    `${typeof selectedDate == "object" ? dayjs(selectedDate).format(DATE_FORMAT_LINE) : selectedDate} ${convert2Utc(
                        dateTime,
                        isOnlyDate ? (maxDateTime ? TIME_HMS_START : TIME_HMS_END) : TIME_HMS_FORMAT
                    )}`
                )

            return maxDateTime <= getDate(startDateTime) || (endDateTime && minDateTime >= getDate(endDateTime))
        },
        [validItem]
    )

    const onChangeDate = useCallback(
        (date: Date) => {
            setOpen(false)

            if (validItem && isValid(date)) {
                if (validItem.startDateTime || validItem.endDateTime) {
                    setOptions({
                        type: ConfirmType.alert,
                        message: v("isExceedEndDate"),
                        buttonStyle: ButtonStyleType.default,
                        applyButtonMessage: g("button.ok"),
                    })
                    setVisible(true)
                }
            } else {
                onChange(date)
            }
        },
        [validItem]
    )

    useEffect(() => {
        if (focus) setOpen(false)
        else dateFormat && onChange(new Date(dateFormat))
    }, [focus])

    useEffect(() => {
        const isOutsideClick = (e: MouseEvent) => {
            if (!!refs.current && !refs.current.calendar?.componentNode.contains(e.target)) {
                setOpen(false)
            }
        }

        window.addEventListener("click", isOutsideClick, true)
        return () => {
            window.removeEventListener("click", isOutsideClick, true)
        }
    }, [])

    //Custom Input Renderer
    const CustomInputTypeText = forwardRef<HTMLInputElement, React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>>(
        ({ value, onClick }, ref) => {
            const [inputDate, setInputDate] = useState(value)

            const onKeyUp = (e: React.KeyboardEvent) => {
                // 하이픈 제거
                if (e.key === "Backspace") setInputDate(inputDate.toString().replace(/-\s*$/, ""))
            }

            const onBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
                setFocus(false)

                const { value } = e.target
                if (!isValidDate(value)) return
                else {
                    if (validItem && isValid(value)) {
                        setOptions({
                            type: ConfirmType.alert,
                            message: v("isExceedEndDate"),
                            buttonStyle: ButtonStyleType.default,
                            applyButtonMessage: g("button.ok"),
                        })
                        setVisible(true)
                    } else {
                        setDateFormat(dayjs(value).format(DATE_FORMAT_LINE))
                    }
                }
            }

            const onKeyDown = (e: React.KeyboardEvent & React.ChangeEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                    const { value } = e.target
                    if (!isValidDate(value)) return
                    else {
                        const date = dayjs(value).format(DATE_FORMAT_LINE)
                        setDateFormat(date)
                        onChange(new Date(date))
                    }
                }
            }

            const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const DATE_LENGTH = 10
                const { value } = e.target
                const validDate = isValidYear(value) || isValidMonth(value) || isValidDay(value) ? autoDayType(value) : value

                if (value.length > DATE_LENGTH) return
                else setInputDate(validDate)
            }

            return (
                <div className="em-datepicker-wrapper" onClick={onClick}>
                    <input
                        ref={ref}
                        type="text"
                        className="em-datepicker-input"
                        onChange={onInputChange}
                        onKeyUp={onKeyUp}
                        onKeyDown={onKeyDown}
                        value={inputDate}
                        readOnly={readOnly}
                        placeholder={DATE_FORMAT_LINE}
                        autoFocus={focus}
                        onFocus={() => setFocus(true)}
                        onBlur={onBlur}
                        disabled={disabled}
                    />
                    <DateRange className="calendar" onMouseUp={() => !disabled && setOpen(!open)} />
                </div>
            )
        }
    )

    CustomInputTypeText.displayName = "CustomInputTypeText"

    return (
        <>
            <DatePicker
                ref={refs}
                open={open}
                wrapperClassName={`em-datePicker ${disabled ? "disabled" : ""}`}
                selected={date}
                onChange={onChangeDate}
                dateFormat={DATE_PICKER_FORMAT}
                customInput={<CustomInputTypeText readOnly={readOnly} />}
                minDate={onChangeDateForm(validItem?.minDateTime).date}
                maxDate={onChangeDateForm(validItem?.maxDateTime).date}
                disabled={disabled}
                disabledKeyboardNavigation={true}
                openToDate={date ?? new Date()}
            />
        </>
    )
}

export default CustomDatePicker
