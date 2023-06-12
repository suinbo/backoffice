export const ValidatorType = {
    password: "password",
    email: "email",
    text: "text",
    number: "number",
    phone: "phone",
    imageUrl: "imageUrl",
    ip: "ip",
    name: "name",
    id: "id",
} as const

export type ValidatorProp<T = string> = {
    key: T
    type?: (typeof ValidatorType)[keyof typeof ValidatorType]
    required?: boolean
    fn?: (value: any, formItems: any) => string | null
}

//기본적인 유효성 검사 양식
const isValidAccessId = (value: string) => /^[A-Za-z0-9-_@.]+$/.test(value)
const isValidPassword = (value: string) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"])[A-Za-z\d\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]{8,}$/g.test(
        value
    )
const isValidText = (value: string) =>
    /^[0-9a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣ぁ-ゔァ-ヴー々〆〤\n\x20\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]*$]*$/g.test(value)
const isValidName = (value: string) => /^[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]*$/g.test(value)
const isSameThreeTimes = (value: string) => /(\w)\1\1\1/g.test(value)
const isValidEmail = (value: string) => /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/g.test(value)
const isValidPhone = (value: string) => /^\d{2,3}-?\d{3,4}-?\d{4}$/g.test(value)
const isValidNumber = (value: string) => /^[0-9]*$/g.test(value)
const isValidYear = (value: string) => /[0-9]{4}$/.test(value)
const isValidMonth = (value: string) => /[0-9]{4}-[0-9]{2}$/.test(value)
const isValidDay = (value: string) => /[0-9]{4}-[0-9]{3}$/.test(value)
const isValidDate = (value: string) => /[0-9]{4}-([1-9]|0[1-9]|1[012])-([1-9]|0[1-9]|[12][0-9]|3[0-1])$/.test(value)
const isValidIp = (value: string) => /^([0-9]{1,3}\.)([0-9]{1,3}\.)([0-9]{1,3}\.)([0-9]{1,3})$/.test(value)
const isIpRange = (value: string) => /\b(?:0\d{1,2}|1\d{2}|2[0-4]\d|[1-9]?\d|25[0-5])\b/.test(value)
const isValidHexCode = (value: string) => /^#[a-fA-F0-9]*$/.test(value)
const isValidEnglishNumber = (value: string) => /^[a-zA-Z0-9]*$/g.test(value)
const isValidInteger = (value: string) => /^-?\d+$/.test(value)

//연속된 알파벳 및 숫자 체크
const isContinuous = (value: string, times: number) => {
    let count = 0
    for (let i = 0; i < value.length - 1; i++) {
        if (/[a-zA-Z0-9]/.test(value.charAt(i))) {
            value.charCodeAt(i + 1) - value.charCodeAt(i) === 1 ? count++ : (count = 0)
            if (count === times - 1) return true
        }
    }
    return false
}

//비밀번호 포맷 체크
const isInValidPassword = ({ password = "", id = "", count = 4 }) => {
    if (!password) return "inValidPassword"
    if (isSameThreeTimes(password)) return "notUseRepeatPatternRegex"
    if (isContinuous(password, count)) return "notUseRepeatPatternRegex"
    if (!!id && password.indexOf(id) > -1) return "notUseIdPatternRegex"
    return ""
}

//시,분 포맷 체크
export const isValidTimeFormat = (value: string) => /^([01][0-9]|[0-5][0-9])$/.test(value)

export {
    isValidAccessId,
    isValidPassword,
    isSameThreeTimes,
    isValidEmail,
    isValidText,
    isValidNumber,
    isValidPhone,
    isContinuous,
    isInValidPassword,
    isValidYear,
    isValidMonth,
    isValidDay,
    isValidDate,
    isValidIp,
    isIpRange,
    isValidHexCode,
    isValidEnglishNumber,
    isValidInteger,
    isValidName,
}
