import dayjs from "dayjs"
import { DATETIME_FORMAT } from "./resources/constants"
import { PageCodeList, PageCodeListProps } from "./apis/request.types"

/** IE Browser 체크 */
export const isInternetExplorer = () => {
    const agent = navigator.userAgent.toLowerCase()
    return agent.indexOf("trident") != -1 || agent.indexOf("msie") != -1
}

/** Convert DateTime to UTC zero */
export const convert2Utc = (date: string | number, format = DATETIME_FORMAT) => {
    return date ? dayjs.unix(typeof date === "string" ? parseInt(date) : date).format(format) ?? dayjs(date).format(DATETIME_FORMAT) : ""
}

/** Convert UTC zero to DateTime  */
export const convertDateTime2Unix = (dateTime: Date | string) => dayjs(dateTime).unix() ?? dayjs(new Date()).unix()

/** Convert UnixTime to {date: Date, time : 'HH:mm:ss'}  */
export const onChangeDateForm = (unixTime: number | string, format = DATETIME_FORMAT) => {
    if (unixTime === null) return { date: null, time: null }
    const [date, time] = convert2Utc(unixTime, format).split(" ")
    return { date: new Date(date), time: time }
}

/** 시스템 코드 포맷 변경(셀렉박스) */
export const changeSystemCodeFormat = (codeList: Array<PageCodeList>, code: string) => {
    const getDepth = codeList[0].leafs.find(leaf => leaf.id == code)
    return getDepth.leafs.map((item: PageCodeListProps) => ({ label: item.name, value: item.id }))
}

/** URL 결합 */
export const combineUrls = (urls: string[]) => urls.join("/")

/**
 * 날짜형식 자동 입력
 * @param value string
 */
export const autoDayType = (value: string) =>
    value
        .replace(/[^0-9]/g, "")
        .replace(/^(\d{0,4})(\d{0,2})(\d{0,2})$/g, "$1-$2-$3")
        .replace(/(-{1,2})$/g, "")

/**
 * Number 3자리마다 쉼표 처리
 * @param {number} value
 * @return string
 */
export const getComma = (value: number) => {
    return value.toLocaleString()
}

/**
 * 시간, 분 2자리 표시
 * @param {string | number} value
 */
export const getTimeDigits = (value: string | number) => {
    const twoWordFormat = 2
    return value.toString().padStart(twoWordFormat, "0")
}

/**
 * 전화번호 자동 하이픈 표시
 * @param value string
 */
export const autoHyphen = (value: string) =>
    value
        .replace(/[^0-9]/g, "")
        .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
        .replace(/(-{1,2})$/g, "")
