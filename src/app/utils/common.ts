import dayjs from "dayjs"
import { DATETIME_FORMAT, DATE_FILE_FORMAT } from "./resources/constants"
import { PageCodeList, PageCodeListProps } from "./apis/request.types"
import { IMAGETYPE } from "./resources/mimeTypes"
import { imageFileProp, imageRequestProp } from "./resources/types"

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

/**
 * 리스트 Drag&Drop 순서 변경
 * @param list Array
 * @param dragIdx Number
 * @param dropIdx Number
 * @param orderKey
 */
export const setListOrderChange = (list: Array<any>, dragIdx: number, dropIdx: number, orderKey = "orderNo") => {
    const changeList = [...list]
    changeList.splice(dropIdx, 0, changeList.splice(dragIdx, 1)[0])
    return changeList.reduce((acc, cur, idx) => {
        acc.push({ ...cur, [orderKey]: idx + 1 })
        return acc
    }, [])
}

/**
 * 이미지 파일 정보 조회
 * @param file 이미지 파일
 * @param prefix 기준 경로
 * @param type 허용할 이미지 타입
 * @param hasSize 이미지 사이즈 표시 여부
 * @imgPath {prefix}/YYYY/MM/DD/{unixTime}_{count}.{ext}
 */
export const uploadImage = ({ file, prefix, type = [IMAGETYPE], hasSize = true }: imageRequestProp) => {
    return new Promise((resolve, reject) => {
        if (!file.type.split("/").some(item => type.includes(item))) {
            // 이미지 타입에 맞지 않을 경우
            reject({ errorType: type || "not match" })
        } else {
            const imageInfo: imageFileProp = {
                src: "",
                no: `image_${dayjs().format("HHmmss")}`,
                imgPath: `${prefix}/${dayjs().format(DATE_FILE_FORMAT)}/${dayjs().unix()}_1.${file.name.split(".").at(-1)}`,
                file: file,
            }

            const imageSize = hasSize && new Image()
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = () => {
                imageInfo.src = reader.result?.toString()
                if (hasSize) {
                    // 상세 이미지 정보(사이즈 O)
                    imageSize.src = reader.result?.toString()
                    imageSize.onload = () => {
                        imageInfo.width = imageSize.width
                        imageInfo.height = imageSize.height
                        resolve(imageInfo)
                    }
                } else {
                    // 기본 이미지 정보(사이즈 X)
                    resolve(imageInfo)
                }
            }
        }
    })
}
