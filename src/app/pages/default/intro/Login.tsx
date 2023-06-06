import React, { useCallback, useEffect, useRef, useState } from "react"
import { useConfirm } from "@/contexts/ConfirmContext"
import { ConfirmType } from "@/components/ui/confirm/types"
import { useTranslation } from "react-i18next"
import { LOGIN_STATUS, MENUS, NUMBER, T_NAMESPACE } from "@/utils/resources/constants"
import { ButtonStyleType } from "@/components/ui/buttons/types"
import { TrendingFlat } from "@material-ui/icons"
import { useNavigate } from "react-router-dom"
import { Storage } from "@/utils/storage"
import { loginProc } from "@/utils/apis/login"
import { useSession } from "@/contexts/SessionContext"
import { useRequest } from "@/contexts/SendApiContext"
import { API, HTTP_METHOD_POST } from "@/utils/apis/request.const"
import ImagePath from "@assets/images/signin-img.svg"
// import SignUp from "@/pages/default/intro/SignUp"
// import TemporaryPassword from "@/pages/default/intro/Password"
import i18next from "i18next"
import cookie from "@/utils/cookie"
import { AxiosError } from "axios"
import "./styles.scss"

export const Login = () => {
    const { t } = useTranslation(T_NAMESPACE.INTRO)
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)

    const navigate = useNavigate()
    const { useAxios } = useRequest()
    const { setSession } = useSession()

    const [signUpShow, setSignUpShow] = useState<boolean>(false)
    const [temporaryPasswordShow, setTemporaryPasswordShow] = useState<boolean>(false)
    const { setVisible, setOptions } = useConfirm()
    const [userId, setUserId] = useState<string>("")
    const [userPw, setUserPw] = useState<string>("")
    const idInputRef = useRef<HTMLInputElement>(null)
    const pwInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        //i18next.changeLanguage("ko")
        cookie.clear()
        Storage.clear()
    }, [])

    const login = useCallback(() => {
        if (!userId || !userPw) {
            setOptions({
                type: ConfirmType.alert,
                message: t("login.emptyIdNPassword"),
                buttonStyle: ButtonStyleType.default,
                applyButtonMessage: g("button.ok"),
                onApply: () => idInputRef.current.focus(),
            })
            setVisible(true)
        } else
            loginProc({ userId, userPw })
                .then(userInfo => {
                    const statusStack = [...userInfo.loginStatus]
                    // statusStack.forEach((status, index) => {
                    const checkStatus = (code: string) => {
                        if ([LOGIN_STATUS.TEMPORARY_PW, LOGIN_STATUS.EXPIRED_PW].includes(code)) {
                            navigate(MENUS.AUTH_PASSWORD) //강제
                        } else {
                            setSession({
                                timeZoneData: userInfo.timeZoneData,
                                languageCode: userInfo.languageCode,
                                loginIp: userInfo.loginIp,
                                loginTime: userInfo.loginTime.toString(),
                                loginId: userInfo.loginId,
                            })
                            //i18next.changeLanguage(userInfo.languageCode)
                            Storage.set(Storage.keys.closePopup, String(false))
                            Storage.set(Storage.keys.expireTime, String(userInfo.expireTime))
                            if (LOGIN_STATUS.AUTH_EMAIL === code) {
                                // 이메일 인증 화면으로 이동
                                Storage.set(Storage.keys.regionCode, userInfo.regionList[0].id)
                                useAxios(
                                    {
                                        url: API.LOGIN_AUTH,
                                        method: HTTP_METHOD_POST,
                                        param: { startDt: Math.floor(new Date().getTime() / NUMBER.MILLISECOND) },
                                    },
                                    () => {
                                        setOptions({
                                            type: ConfirmType.alert,
                                            message: g("alert.issueEmailAlert"),
                                            buttonStyle: ButtonStyleType.default,
                                            applyButtonMessage: g("button.ok"),
                                            onApply: () => navigate(MENUS.AUTH_EMAIL),
                                        })
                                        setVisible(true)
                                    }
                                )
                            } else if (code == LOGIN_STATUS.MULTIPLE_LOGIN) {
                                // 이미 접속한 계정이 있을 경우 알려주고 로그인
                                setOptions({
                                    type: ConfirmType.alert,
                                    message: g("alert.multipleLogin"),
                                    buttonStyle: ButtonStyleType.default,
                                    applyButtonMessage: g("button.ok"),
                                    onApply: () => {
                                        if (statusStack.length) checkStatus(statusStack.shift())
                                        else navigate("/")
                                    },
                                })
                                setVisible(true)
                            } else {
                                navigate("/")
                            }
                        }
                    }
                    statusStack.length && checkStatus(statusStack.shift())
                })
                .catch((err: AxiosError) => {
                    setOptions({
                        type: ConfirmType.alert,
                        message: err.message,
                        buttonStyle: ButtonStyleType.default,
                        applyButtonMessage: g("button.ok"),
                        onApply: () => pwInputRef.current.focus(),
                    })
                    setVisible(true)
                })
    }, [userId, userPw])

    const onIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserId(e.target.value)
    }

    const onPwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserPw(e.target.value)
    }

    const enterCheck = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") login()
        },
        [userPw, userId]
    )

    return (
            <div id="signIn">
                <div className="container">
                    <div className="sign-in-container">
                        <div className="sign-in">
                            <div className="form-box">
                                <h2 className="title">SIGN IN</h2>
                                <div className="input-field">
                                    <label htmlFor="userID">ID</label>
                                    <input
                                        ref={idInputRef}
                                        id="userID"
                                        type="text"
                                        placeholder="ID를 입력해주세요."
                                        onChange={e => onIdChange(e)}
                                        onKeyDown={e => enterCheck(e)}
                                        value={userId}
                                        autoFocus
                                    />
                                </div>
                                <div className="input-field">
                                    <label htmlFor="passWord">PW</label>
                                    <input
                                        ref={pwInputRef}
                                        id="passWord"
                                        type="password"
                                        placeholder="비밀번호를 입력해주세요."
                                        onChange={e => onPwChange(e)}
                                        onKeyDown={e => enterCheck(e)}
                                        value={userPw}
                                    />
                                </div>
                                <div className="input-field">
                                    <button className="submit-btn" onClick={login}>
                                        LOGIN
                                    </button>
                                </div>
                            </div>
                            <div className="account-button">
                                <button onClick={() => setSignUpShow(true)}>
                                    계정신청 하기
                                    <TrendingFlat className="trending-flat" />
                                </button>
                                <button onClick={() => setTemporaryPasswordShow(true)}>임시비밀번호 발급</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="instructions-container">
                    <div className="instructions">
                        <div className="content">
                            <ul className="instructions-list">
                                <li>
                                    고객의 개인정보를 훼손, 침해 또는 누설할 경우 개인정보보호법 제 59조에 의거하여 <br />
                                    5년 이하의 징역 또는 5천만원 이하의 벌금에 처해질 수 있습니다.
                                </li>
                            </ul>
                            <div className="system-administrator">
                                <span>[시스템 관리자]</span>
                                <ul>
                                    <li>황보수인님 (suin9610@gmail.com)</li>
                                </ul>
                            </div>
                        </div>
                        <img src={ImagePath as string} className="image" />
                    </div>
                </div>
 
                {/* {signUpShow && <SignUp onClose={() => setSignUpShow(false)} />}
                {temporaryPasswordShow && <TemporaryPassword onClose={() => setTemporaryPasswordShow(false)} />} */}
            </div>
    )
}

export default Login
