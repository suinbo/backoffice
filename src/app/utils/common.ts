import dayjs from "dayjs"
import { DATETIME_FORMAT } from "./resources/constants"

/** IE Browser 체크 */
export const isInternetExplorer = () => {
    const agent = navigator.userAgent.toLowerCase()
    return agent.indexOf("trident") != -1 || agent.indexOf("msie") != -1
}

/** Convert DateTime to UTC zero */
export const convert2Utc = (date: string | number, format = DATETIME_FORMAT) => {
    return date ? dayjs.unix(typeof date === "string" ? parseInt(date) : date).format(format) ?? dayjs(date).format(DATETIME_FORMAT) : ""
}

/** URL 결합 */
export const combineUrls = (urls: string[]) => urls.join("/")

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
