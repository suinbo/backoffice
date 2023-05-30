import { apiRequest, INSTANCE_TYPE } from "@/utils/apis/request"
import React, { useContext, useMemo, useState } from "react"
import { createContext } from "react-activation"
import Loading from "@/components/ui/progress"
import { API_BOGW_REQUEST_URL, HTTP_METHOD_GET, HTTP_METHOD_POST, X_AUTH_TOKEN } from "@/utils/apis/request.const"
import { AxiosError, AxiosResponse, Method } from "axios"
import cookie from "@/utils/cookie"
import { Storage } from "@/utils/storage"
import { useQueries, useQuery, useQueryClient, UseQueryOptions, UseQueryResult } from "@tanstack/react-query"
import "./styles"

type HeaderConfig = {
    regionCd?: string
    langCd?: string
    ctsLangCd?: string
    adminId?: string
    Authorization?: string
    "Access-Control-Allow-Headers"?: string
    "content-type"?: string
}

type ReactQueryConfig = {
    url?: string
    data?: any
    method?: Method
    key?: string
    headers?: HeaderConfig
}

type useAxiosConfig = {
    url: string
    method?: Method
    param?: any
    isLoading?: boolean
    instanceType?: string
    headers?: HeaderConfig
}

type initStateProps = {
    useAxios: (
        { url, method, param, isLoading, instanceType, headers }: useAxiosConfig,
        successCallback?: (res: AxiosResponse) => void,
        failCallback?: (err: AxiosError) => void
    ) => void

    /**
     * Promise all ReactQuery GET
     * @param key
     */
    useFetchAll: <T = any>(keys: ReactQueryConfig[], options?: UseQueryOptions) => UseQueryResult<T>

    /**
     * React Query POST
     * @param {ReactQueryConfig} key
     * @param {UseQueryResult} options
     * @returns
     */
    usePost: <T = any>(key: ReactQueryConfig, options?: UseQueryOptions) => UseQueryResult<T>

    /**
     * React Query GET
     * @param {ReactQueryConfig} key
     * @param {ReactQueryConfiguration} options
     * @returns
     */
    useFetch: <T = any>(key: ReactQueryConfig, options?: UseQueryOptions) => UseQueryResult<T>
    globalMutate: (key: Array<string>) => void
}

const SendAPIContext = createContext<initStateProps | null>(null)
SendAPIContext.displayName = "SEND_API_CONTEXT"

export const useRequest = () => useContext(SendAPIContext)

export const SendAPIProvider = ({ children }: { children: JSX.Element }) => {
    const queryClient = useQueryClient()
    const [loading, setLoading] = useState<boolean>(false)

    // axios 직접 호출
    const useAxios = (
        {
            url,
            method = HTTP_METHOD_POST,
            param = null,
            isLoading = true,
            instanceType = INSTANCE_TYPE.BACKOFFICE,
            headers = {
                "content-type": "application/json;",
            },
        }: useAxiosConfig,
        successCallback?: (res: any) => void,
        failCallback?: (err: AxiosError) => void
    ) => {
        setLoading(isLoading)
        const apiData = { url: url, method: method, data: param }
        const getReq = gwRequest({ ...apiData, headers })
        getReq
            .then(successCallback)
            .catch(failCallback)
            .finally(() => setLoading(false))
    }

    /** BACKOFFICE API 요청 hook */
    const useFetch = (key: ReactQueryConfig, options?: UseQueryOptions) => {
        return useQuery({
            queryKey: [key],
            queryFn: () => gwRequest({ ...key, method: HTTP_METHOD_GET }),
            enabled: !!key,
            refetchOnWindowFocus: false,
            retry: false, // api 에러 재시도 없음
            ...options,
        })
    }

    const usePost = (key: ReactQueryConfig, options?: UseQueryOptions) => {
        return useQuery({
            queryKey: [key],
            queryFn: () => gwRequest({ ...key, method: HTTP_METHOD_POST }),
            enabled: !!key,
            refetchOnWindowFocus: false,
            retry: false, // api 에러 재시도 없음
            ...options,
        })
    }

    const globalMutate = (key: Array<string>) => {
        key.map(item => queryClient.invalidateQueries({ queryKey: [{ key: item }] }))
    }

    const isReject = (input: PromiseSettledResult<unknown>): input is PromiseRejectedResult => input.status === "rejected"
    const isFulfilled = <T,>(input: PromiseSettledResult<T>): input is PromiseFulfilledResult<T> => input.status === "fulfilled"

    const useFetchAll = (keys: ReactQueryConfig[], options?: UseQueryOptions) => {
        const queries = keys.map(key => ({
            queryKey: [key.url],
            queryFn: () => gwRequest({ ...key, method: HTTP_METHOD_GET }),
            enabled: !!key,
            refetchOnWindowFocus: false,
            ...options,
        }))

        return useQueries({ queries })
    }

    /** Gateway Service Api Request */
    const gwRequest = (config: ReactQueryConfig) => {
        const { /*key,*/ ...apiConfig } = config

        const options = Object.assign(apiConfig, {
            baseURL: API_BOGW_REQUEST_URL,
            headers: Object.assign(
                {
                    Authorization: `Bearer ${cookie.getItem(cookie.keys.credential)}`,
                    "Access-Control-Allow-Headers": "x-auth-token",
                    regionCd: Storage.get(Storage.keys.regionCode) || "",
                    langCd: Storage.get(Storage.keys.languageCode) || "",
                    ctsLangCd: Storage.get(Storage.keys.regionLangCode),
                    adminId: Storage.get(Storage.keys.loginId) || "",
                },
                config.headers
            ),
        })

        if (!config.url) return null
        return apiRequest(options).then(response => {
            const token = response.headers[X_AUTH_TOKEN] ?? response.headers[X_AUTH_TOKEN.toUpperCase()] ?? cookie.getItem(cookie.keys.credential)
            token && cookie.setItem({ key: cookie.keys.credential, value: token })
            return response.data ?? []
        })
    }

    const value = useMemo(() => ({ useAxios, useFetch, usePost, useFetchAll, isReject, isFulfilled, globalMutate }), [])
    return (
        <SendAPIContext.Provider value={value}>
            {loading && (
                <div className="loading-area">
                    <Loading />
                </div>
            )}
            {children}
        </SendAPIContext.Provider>
    )
}
