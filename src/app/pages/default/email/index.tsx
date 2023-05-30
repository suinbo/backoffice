// import React, { useCallback, useEffect, useRef, useState } from "react"
// import { Button } from "@/components/ui/buttons"
// import { ButtonStyleType } from "@/components/ui/buttons/types"
// import { ConfirmType } from "@/components/ui/confirm/types"
// import { useConfirm } from "@/contexts/ConfirmContext"
// import { useRequest } from "@/contexts/SendApiContext"
// import { API, HTTP_METHOD_POST } from "@/utils/apis/request.const"
// import { getTimeDigits } from "@/utils/common"
// import { MENUS, NUMBER, RESPONSE_CODE } from "@/utils/resources/constants"
// import { isValidNumber } from "@/utils/resources/validators"
// import { Storage } from "@/utils/storage"
// import { useNavigate } from "react-router-dom"
// import Label from "@/components/ui/forms/Label"
// import FormItem from "@/components/ui/forms/FormItem"
// import cookie from "@/utils/cookie"
// import logoImagePath from "@assets/images/logo.svg"
// import "./styles.scss"

// const EMAIL_AUTH_LENGTH = 7
// const EMAIL_AUTH_SUB_LENGTH = 6

// const AuthEmail = () => {
//     /** 카운트 다운 및 인풋 발류*/
//     const timer = useRef(null)
//     const inputRef = useRef<HTMLInputElement>(null)
//     const [expireTime, setExpireTime] = useState(NUMBER.TEN_MINUTE_SECOND)
//     const [value, setValue] = useState<string>("")
//     const [failCount, setFailCount] = useState(0)

//     /** 컨펌 훅 및 리퀘스트 훅 */
//     const { setVisible, setOptions } = useConfirm()
//     const { useAxios } = useRequest()
//     const navigate = useNavigate()

//     /** 타이머 세팅 */
//     const startTime = useCallback(() => {
//         setExpireTime(NUMBER.TEN_MINUTE_SECOND)
//         timer.current = setInterval(() => {
//             setExpireTime(prev => {
//                 if (prev <= 0) {
//                     endTime()
//                     setOptions({
//                         type: ConfirmType.alert,
//                         message: "인증번호가 만료 되었습니다.\n재발급 해주세요.",
//                         buttonStyle: ButtonStyleType.default,
//                         applyButtonMessage: "확인",
//                         onApply: () => {
//                             setValue("")
//                             inputRef.current.focus()
//                         },
//                     })
//                     setVisible(true)
//                     return 0
//                 } else return prev - 1
//             })
//         }, NUMBER.MILLISECOND)
//     }, [])

//     /** 타이머 해제 */
//     const endTime = useCallback(() => {
//         clearInterval(timer.current)
//         timer.current = null
//     }, [])

//     /** mm:ss 단위로 표시 */
//     const convertTime = (second: number) =>
//         `${Math.floor(second / NUMBER.ONE_MINUTE_SECOND)}:${getTimeDigits(Math.floor(second % NUMBER.ONE_MINUTE_SECOND))}`

//     // 초기 세팅
//     useEffect(() => {
//         init()
//         inputRef.current.focus()
//         Storage.set(Storage.keys.expireTime, String(NUMBER.ZERO))
//     }, [])

//     const init = useCallback(() => {
//         setFailCount(0)
//         endTime()
//         startTime()
//     }, [])

//     /** 인풋 체인지 */
//     const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//         const { value } = e.target
//         isValidNumber(value) && setValue(value.length < EMAIL_AUTH_LENGTH ? value : value.substring(0, EMAIL_AUTH_SUB_LENGTH))
//     }, [])

//     /** 인증 번호로 로그인 */
//     const loginAuth = useCallback(() => {
//         if (value.length && expireTime) {
//             useAxios(
//                 {
//                     url: API.LOGIN_EMAIL_CHECK,
//                     method: HTTP_METHOD_POST,
//                     param: { authNum: value },
//                 },
//                 res => {
//                     if (res.code) {
//                         // 인증 실패 시
//                         setOptions({
//                             type: ConfirmType.alert,
//                             message: res.message,
//                             buttonStyle: ButtonStyleType.default,
//                             applyButtonMessage: "확인",
//                             onApply: () => {
//                                 setValue("")
//                                 const { code } = res
//                                 inputRef.current.focus()
//                                 if (code === RESPONSE_CODE.AUTH_NUMBER_NOT_MATCH) {
//                                     setFailCount(prev => prev + 1)
//                                 } else if (code === RESPONSE_CODE.AUTH_NUMBER_FAIL) {
//                                     endTime()
//                                     navigate(MENUS.SIGNIN)
//                                 } else if (code === RESPONSE_CODE.AUTH_NUMBER_EXPIRED) {
//                                     endTime()
//                                     setExpireTime(0)
//                                 }
//                             },
//                         })
//                         setVisible(true)
//                     } else {
//                         endTime()
//                         cookie.setItem({
//                             key: cookie.keys.credential,
//                             value: res.accessToken,
//                             expire: res.expireTime,
//                         })
//                         Storage.set(Storage.keys.closePopup, String(false))
//                         Storage.set(Storage.keys.expireTime, res.expireTime)
//                         navigate(MENUS.HOME)
//                     }
//                 }
//             )
//         }
//     }, [value, expireTime])

//     /** 이메일 인증번호 발급 */
//     const issueEmailAuth = useCallback(() => {
//         init()
//         useAxios(
//             {
//                 url: API.LOGIN_AUTH,
//                 method: HTTP_METHOD_POST,
//                 param: { startDt: Math.floor(new Date().getTime() / NUMBER.MILLISECOND) },
//             },
//             () => {
//                 setOptions({
//                     type: ConfirmType.alert,
//                     message: "해당 E-MAIL로 인증번호가 발급되었습니다.",
//                     buttonStyle: ButtonStyleType.default,
//                     applyButtonMessage: "확인",
//                     onApply: () => {
//                         setValue("")
//                         inputRef.current.focus()
//                     },
//                 })
//                 setVisible(true)
//             }
//         )
//     }, [])

//     /** 취소 버튼 클릭 시 로그인 화면으로 이동 */
//     const onCancel = useCallback(() => {
//         endTime()
//         navigate(MENUS.SIGNIN)
//     }, [])

//     return (
//         <div id="authEmail">
//             <div className="form">
//                 <img src={logoImagePath} className="logo-image" />
//                 <div className="title-wrapper">
//                     <p className="title">이메일 인증</p>
//                     <p className="sub-description">* 계정신청 시 등록한 이메일로 발송된 인증 번호를 입력해주세요.</p>
//                     <p className="sub-description">{`* 실패횟수 ${failCount}/3`}</p>
//                 </div>
//                 <FormItem>
//                     <Label id="authNum" value={"인증번호"} />
//                     <div className="form-item-group">
//                         <div className="form-item-input">
//                             <input
//                                 ref={inputRef}
//                                 id="authNum"
//                                 type="password"
//                                 placeholder={"인증번호를 입력하세요"}
//                                 onChange={handleChange}
//                                 onKeyUp={e => e.key === "Enter" && loginAuth()}
//                                 value={value}
//                             />
//                             <span className="expire-time"> {convertTime(expireTime)} </span>
//                         </div>
//                         <Button styleType={ButtonStyleType.primary} disabled={!expireTime || !value} onClick={loginAuth}>
//                             {expireTime ? "인증" : "유효시간 만료"}
//                         </Button>
//                     </div>
//                 </FormItem>
//                 <div className="button-group">
//                     <Button styleType={ButtonStyleType.primary} border={true} onClick={issueEmailAuth}>
//                         재발급
//                     </Button>
//                     <Button styleType={ButtonStyleType.default} onClick={onCancel}>
//                         취소
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default AuthEmail
