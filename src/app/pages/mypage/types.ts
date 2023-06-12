import { TableList } from "@/utils/apis/request.types"

export type passwordType = {
    secretPw: string
    setSecretPw: string
    checkSecretPw: string
    accessId: string
}

export type HistoryType = TableList<UserHistoryType[]>

export type UserHistoryType = {
    no: string
    historyDesc: string
    historyDate: string
    ip: string
}

export type UserInfoType = {
    id: string
    name: string
    phone: string
    email: string
    department: string
    createDate?: number
    langCode?: string
    timeCode?: string
    timeValue?: number
    secretPw?: string
    setSecretPw?: string
    checkSecretPw?: string
    isValidId?: boolean
}

export type TimezoneType = {
    timeCode: string
    timeDefault: boolean
    timeName: string
    timeValue: number
}

export type LangType = {
    code: string
    defaultNm: string
    name: string
}
