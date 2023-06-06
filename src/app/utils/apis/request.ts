import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import { stringify } from "query-string"
import { RESPONSE_CODE } from "../resources/constants"
import { RowItem } from "../resources/types"
import { Storage } from "../storage"
import { API_REQUEST_URL, HTTP_METHOD_GET } from "./request.const"
import cookie from "../cookie"

export const INSTANCE_TYPE = {
    BACKOFFICE: "backOffice",
    CONTENT: "content",
    TVINGTALK: "tvingTalk",
    BOGW: "bogw",
} as const

export type instanceConfig = {
    baseURL: string
} & Partial<AxiosRequestConfig>

export const instance = axios.create({
    baseURL: API_REQUEST_URL,
    timeout: 60000,
})

/** return Axios instance and request with HTTP  */
export const apiRequest = (req: instanceConfig) => {
    instance.defaults.baseURL = req.baseURL
    return instance(req)
        .then((response: AxiosResponse<RowItem, RowItem>) => {
            const {
                data: { data, code, detailMessage },
                headers,
            } = response
            // response data alert 노출

            switch (code) {
                case RESPONSE_CODE.SUCCESS:
                    return { data, headers }
                case RESPONSE_CODE.AUTH_NUMBER_EXPIRED:
                case RESPONSE_CODE.AUTH_NUMBER_NOT_FOUND:
                case RESPONSE_CODE.AUTH_NUMBER_NOT_MATCH:
                case RESPONSE_CODE.AUTH_NUMBER_FAIL:
                    // 로그인 2차 인증 실패 시 code, detailMessage 전달
                    return { data: { code, message: detailMessage }, headers: headers }
                default:
                    throw new Error(detailMessage)
            }
        })
        .catch((error: AxiosError) => {
            throw new Error(error.message)
        })
}

/** Make query params */
export const applyQueryString = (url: string, queryString: object) => `${url}?${stringify(queryString)}`

/** Make path variable */
export const applyPath = (url: string, path: string) => `${url}/${path}`

/** CSV Data Excel Download */
export const excelApiRequest = (apiUrl: string) => {
    const optionConfig: Partial<AxiosRequestConfig> = {
        baseURL: API_REQUEST_URL,
        headers: {
            Authorization: `Bearer ${cookie.getItem(cookie.keys.credential)}`,
            "Access-Control-Allow-Headers": "x-auth-token",
            regionCd: Storage.get(Storage.keys.regionCode) || "",
            langCd: Storage.get(Storage.keys.languageCode) || "",
            ctsLangCd: Storage.get(Storage.keys.regionLangCode),
            adminId: encodeURIComponent(Storage.get(Storage.keys.loginId)) || "",
        },
        url: apiUrl,
        method: HTTP_METHOD_GET,
        responseType: "blob",
    }

    return axios(optionConfig)
        .then(res => res.data as BlobPart)
        .catch((error: AxiosError) => {
            throw new Error(error.message)
        })
}
