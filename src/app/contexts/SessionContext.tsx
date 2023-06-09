import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { Storage } from "@/utils/storage"
import i18next from "i18next"

type sessionDataProps = {
    timeZoneData?: number
    languageCode?: string
    loginIp?: string
    loginTime?: string
    loginId?: string
    expireTime?: number
}

interface SessionContext {
    session: sessionDataProps
    setSession: (data: sessionDataProps) => void
    updatedSessionLoginId: (loginId: string) => void
}

const defaultState: sessionDataProps = {
    timeZoneData: 0,
    languageCode: "",
    loginIp: "",
    loginTime: "",
    loginId: "",
    expireTime: 0,
}

const initState: SessionContext = {
    session: { ...defaultState },
    setSession: () => ({}),
    updatedSessionLoginId: () => ({}),
}

const SessionContext = createContext<SessionContext>({ ...initState })
SessionContext.displayName = "SESSION_CONTEXT"

export const useSession = () => useContext(SessionContext)

export const SessionProvider = React.memo(({ children }) => {
    const data: sessionDataProps = {
        timeZoneData: parseInt(Storage.get(Storage.keys.timeZoneData) || "0"),
        languageCode: Storage.get(Storage.keys.languageCode) || "",
        loginIp: Storage.get(Storage.keys.loginIp) || "",
        loginTime: Storage.get(Storage.keys.loginTime) || "0",
        loginId: Storage.get(Storage.keys.loginId) || "",
        expireTime: parseInt(Storage.get(Storage.keys.expireTime) || "0"),
    }

    const [session, setSessionData] = useState({ ...data })

    /** 다국어 로케일 변경 */
    useEffect(() => {
        if (session.languageCode) {
            //if (i18next.language !== session.languageCode) i18next.changeLanguage(session.languageCode)
        }
    }, [])

    const setSession = useCallback(
        ({
            languageCode,
            timeZoneData,
            loginIp = session.loginIp,
            loginTime = session.loginTime,
            loginId = session.loginId,
            expireTime = session.expireTime,
        }: sessionDataProps) => {
            Storage.set(Storage.keys.languageCode, languageCode)
            Storage.set(Storage.keys.timeZoneData, String(timeZoneData))
            Storage.set(Storage.keys.loginIp, loginIp)
            Storage.set(Storage.keys.loginTime, loginTime)
            Storage.set(Storage.keys.loginId, loginId)
            Storage.set(Storage.keys.expireTime, String(expireTime))

            setSessionData({
                loginIp,
                loginTime,
                timeZoneData,
                languageCode,
                loginId,
                expireTime,
            })
        },
        [session]
    )

    const updatedSessionLoginId = (loginId: string) => {
        Storage.set(Storage.keys.loginId, loginId)
        setSessionData(prev => ({ ...prev, loginId }))
    }

    const value = useMemo(() => ({ session, setSession, updatedSessionLoginId }), [session])

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
})
