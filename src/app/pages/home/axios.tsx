import React, { useMemo } from "react"
import { ButtonStyleType } from "@/components/ui/buttons/types"
import { useConfirm } from "@/contexts/ConfirmContext"
import { instance } from "@/utils/apis/request"
import { HTTP_STATUS, RESPONSE_CODE, T_NAMESPACE } from "@/utils/resources/constants"
import { useTranslation } from "react-i18next"
import { AxiosError, AxiosResponse } from "axios"
import cookie from "@/utils/cookie"
import { history } from "@/history"
import { Storage } from "@/utils/storage"

const Axios = ({ children }: any) => {
    const { setVisible, setOptions } = useConfirm()
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)

    useMemo(() => {
        instance.interceptors.response.use(
            (response: AxiosResponse<{ code: string; detailMessage: string; message: string }>) => {
                const {
                    data: { code, detailMessage, message },
                } = response

                switch (code) {
                    case RESPONSE_CODE.SUCCESS:
                    case RESPONSE_CODE.AUTH_NUMBER_EXPIRED:
                    case RESPONSE_CODE.AUTH_NUMBER_NOT_FOUND:
                    case RESPONSE_CODE.AUTH_NUMBER_NOT_MATCH:
                    case RESPONSE_CODE.AUTH_NUMBER_FAIL:
                        return response
                    default:
                        setOptions({
                            message: detailMessage ?? message,
                            buttonStyle: ButtonStyleType.default,
                            applyButtonMessage: g("button.ok"),
                        })
                        setVisible(true)
                        throw new Error(detailMessage ?? message)
                }
            },
            (error: AxiosError) => {
                if (error.response) {
                    const { status, data } = error.response
                    if (status === HTTP_STATUS.UNAUTHORIZED) {
                        if (top === window) {
                            // 세션 만료 상태에서 브라우저 재진입시 로그인 페이지 이동
                            if (!cookie.getItem(cookie.keys.credential)) {
                                history.replace("/signin")
                            } else {
                                setOptions({
                                    buttonStyle: ButtonStyleType.default,
                                    message: g("alert.loginEnd"),
                                    applyButtonMessage: g("button.ok"),
                                    onApply: () => {
                                        history.replace("/signin")
                                    },
                                })
                                setVisible(true)
                            }
                        }
                        Storage.set(Storage.keys.expireTime, "0")
                    } else {
                        setOptions({
                            message: data.message ?? error.message,
                            buttonStyle: ButtonStyleType.default,
                            applyButtonMessage: g("button.ok"),
                        })
                        setVisible(true)
                    }
                }
                return Promise.reject(error)
            }
        )
    }, [])

    return <>{children}</>
}

export default Axios
