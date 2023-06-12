import {
    isValidEmail,
    isValidNumber,
    isValidPhone,
    isValidText,
    ValidatorProp,
    ValidatorType,
    isValidPassword,
    isValidIp,
    isValidName,
    isValidAccessId,
} from "@/utils/resources/validators"
import { useCallback } from "react"

const Validator = [
    { type: ValidatorType.text, fn: isValidText, message: "inValidText" },
    { type: ValidatorType.name, fn: isValidName, message: "inValidName" },
    { type: ValidatorType.email, fn: isValidEmail, message: "inValidEmail" },
    { type: ValidatorType.number, fn: isValidNumber, message: "inValidNumber" },
    { type: ValidatorType.phone, fn: isValidPhone, message: "inValidPhone" },
    { type: ValidatorType.password, fn: isValidPassword, message: "inValidPassword" },
    { type: ValidatorType.ip, fn: isValidIp, message: "inValidIp" },
    { type: ValidatorType.id, fn: isValidAccessId, message: "inValidId" },
]

/** 폼 유효성 검사 */
export const useValidate = <T = { [key: string]: unknown }>(formItems: T) => {
    const isValid = useCallback(
        (validator: Array<ValidatorProp>, cb: (valid: boolean, errors: Array<{ key: string; message: string }>) => void) => {
            let valid = true
            const errors: Array<{ key: string; message: string }> = []

            for (const [key, value] of Object.entries(formItems)) {
                try {
                    const validObj = validator.find(v => v.key === key)
                    if (validObj) {
                        const { type, fn } = validObj
                        const _validator = Validator.find(item => item.type === type)

                        if (!!validObj.required && (!String(value).trim() || !value)) throw new Error("inValidRequired")
                        if (!!_validator && !_validator.fn(value as string)) throw new Error(_validator.message)
                        if (fn) {
                            const message = fn(value, formItems)
                            if (message) throw new Error(message)
                        }

                        continue
                    }
                } catch (error) {
                    valid = false
                    errors.push({
                        key: key,
                        message: (error as Error).message ?? "inValidValue",
                    })
                }
            }

            cb(valid, errors)
        },
        [formItems]
    )

    return { isValid }
}
