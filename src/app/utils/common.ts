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

/**
 * 시간, 분 2자리 표시
 * @param {string | number} value
 */
export const getTimeDigits = (value: string | number) => {
    const twoWordFormat = 2
    return value.toString().padStart(twoWordFormat, "0")
}
