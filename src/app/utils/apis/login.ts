import cookie from "@/utils/cookie"
import { history } from "@/history"
import { Storage } from "@/utils/storage"
import { apiRequest } from "./request"
import { API, API_REQUEST_URL, HTTP_METHOD_POST, X_AUTH_TOKEN } from "./request.const"
import { AxiosRequestConfig, AxiosResponseHeaders } from "axios"

type LoginProps = {
    userId: string
    userPw: string
    accessId: string
    secretPw: string
}

type LoginResponseProps = {
    headers: AxiosResponseHeaders
    data: {
        accessToken: string
        expireTime: number
        languageCode: string
        loginId: string
        loginIp: string
        loginStatus: string[]
        loginTime: number
        regionList: Array<{ id: string }>
        timeZoneData: number
    }
}

export const loginProc = async ({ userId, userPw }: Partial<LoginProps>) => {
    return await postLogin({ accessId: userId, secretPw: encodeURIComponent(userPw) })
        .then(response => {
            const { accessToken, ...userInfo } = response.data
            const expire = userInfo.expireTime.toString()
            cookie.setItem({
                key: cookie.keys.credential,
                value: accessToken,
                expire,
            })

            cookie.setItem({
                key: cookie.keys.userInfo,
                value: JSON.stringify({ status: userInfo.loginStatus }),
                expire,
            })

            cookie.setItem({
                key: cookie.keys.expireTime,
                value: expire,
                expire,
            })

            return userInfo
        })
        .catch(err => Promise.reject(err))
}

// request Header setting
const options = (req: AxiosRequestConfig) => {
    const config = Object.assign(req, {
        baseURL: API_REQUEST_URL,
        headers: {
            Authorization: `Bearer ${cookie.getItem(cookie.keys.credential)}`,
            "Access-Control-Allow-Headers": "x-auth-token",
            regionCd: Storage.get(Storage.keys.regionCode) || "",
            langCd: Storage.get(Storage.keys.languageCode) || "",
        },
    })
    return config
}

/** 로그아웃 */
export const logoutProc = async () => {
    const req: AxiosRequestConfig = {
        url: API.LOGOUT,
        method: HTTP_METHOD_POST,
    }

    return await apiRequest(options(req)).finally(() => {
        cookie.removeItem(cookie.keys.credential)
        cookie.removeItem(cookie.keys.expireTime)
        Storage.clear()
        history.replace("/signin")
    })
}

/** 로그인 */
export const postLogin = async ({ accessId, secretPw }: Partial<LoginProps>) => {
    const req: AxiosRequestConfig = {
        url: API.LOGIN,
        method: HTTP_METHOD_POST,
        data: { accessId, secretPw },
    }

    return (await apiRequest(options(req)).then(response => {
        // 로그인시 쿠키 잘못된 값 저장 방지
        const token = response.headers[X_AUTH_TOKEN] ?? response.headers[X_AUTH_TOKEN.toUpperCase()] ?? cookie.getItem(cookie.keys.credential)
        token && cookie.setItem({ key: cookie.keys.credential, value: token })

        return response
    })) as LoginResponseProps
}
