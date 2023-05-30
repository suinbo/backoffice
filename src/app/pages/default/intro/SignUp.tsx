// import React, { useCallback, useState } from "react"
// import { AccountCircle, Close } from "@material-ui/icons"
// import { ButtonStyleType } from "@/components/ui/buttons/types"
// import { Button } from "@/components/ui/buttons"
// import { NUMBER, T_NAMESPACE } from "@/utils/resources/constants"
// import { useTranslation } from "react-i18next"
// import { isInValidPassword, isValidAccessId, ValidatorProp, ValidatorType } from "@/utils/resources/validators"
// import { useConfirm } from "@/contexts/ConfirmContext"
// import { ConfirmType } from "@/components/ui/confirm/types"
// import { useValidate } from "@/hooks/useValidate"
// import { API, HTTP_METHOD_GET } from "@/utils/apis/request.const"
// import { autoHyphen } from "@/utils/common"
// import { useRequest } from "@/contexts/SendApiContext"
// import { applyQueryString } from "@/utils/apis/request"
// import { ValidProp, SignUpProp } from "./types"
// import Modal from "@/components/ui/modal"
// import FormItem from "@/components/ui/forms/FormItem"
// import Label from "@/components/ui/forms/Label"
// import Input from "@/components/ui/forms/Input"
// import "./styles.scss"
// import { AxiosError } from "axios"

// const defaultFormItem: SignUpProp = {
//     accessId: "",
//     secretPw: "",
//     name: "",
//     phone: "",
//     email: "",
//     department: "",
// }

// const defaultValidInformation: ValidProp = {
//     isIDChecked: false, // 중복확인 체크여부
//     existYn: false, // 아이디 중복여부
//     checkSecretPw: "", // 비밀본호 확인
// }

// const validator: Array<ValidatorProp> = [
//     { key: "isIDChecked", type: ValidatorType.text, fn: isIDChecked => (isIDChecked ? null : "needIDChecked") },
//     { key: "existYn", type: ValidatorType.text, fn: existYn => (existYn ? "existId" : null) },
//     { key: "accessId", required: true, type: ValidatorType.text },
//     { key: "name", required: true, type: ValidatorType.text },
//     { key: "email", required: true, type: ValidatorType.email },
//     { key: "phone", required: true, type: ValidatorType.phone },
//     { key: "department", required: true, type: ValidatorType.text },
//     {
//         key: "secretPw",
//         required: true,
//         type: ValidatorType.password,
//         fn: (secretPw, formItem) => isInValidPassword({ password: secretPw, id: formItem.accessId }),
//     },
//     {
//         key: "checkSecretPw",
//         required: true,
//         type: ValidatorType.password,
//         fn: (checkSecretPw, formItem) => (formItem.secretPw === checkSecretPw ? null : "mismatchPassword"),
//     },
// ]

// export const SignUp = ({ onClose }: { onClose: () => void }) => {
//     const { t: i } = useTranslation(T_NAMESPACE.INTRO)
//     const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
//     const { t: v } = useTranslation(T_NAMESPACE.VALIDATE)
//     const { useAxios } = useRequest()

//     /** 회원가입 폼아이템 ,유효성 검사 폼, 컨펌창, 유효성검사 */
//     const [formItem, setFormItem] = useState<SignUpProp>({ ...defaultFormItem })
//     const [validInformation, setValidInformation] = useState<ValidProp>({ ...defaultValidInformation })
//     const { setVisible, setOptions } = useConfirm()
//     const { isValid } = useValidate<ValidProp & SignUpProp>({ ...formItem, ...validInformation })

//     /** handleChange Phone of FormItem */
//     const handlePhoneChange = useCallback(
//         (e: React.ChangeEvent<HTMLInputElement>) => {
//             e.stopPropagation()
//             const { id, value } = e.target
//             const setValue = value.trim().length > NUMBER.MAX_PHONE_LENGTH ? value.replace(/[^0-9]/g, "").substring(0, NUMBER.PHONE_LENGTH) : value
//             setFormItem(prev => ({ ...prev, [id]: autoHyphen(setValue) }))
//         },
//         [formItem]
//     )

//     /** handleChange FormItem */
//     const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         e.stopPropagation()
//         const { id, value } = e.target
//         setFormItem(prev => ({ ...prev, [id]: value.trim() }))
//     }, [])

//     /** ID 입력 event */
//     const handleIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const value = e.target.value.trim()

//         if (!value || isValidAccessId(value)) {
//             setFormItem(prev => ({ ...prev, accessId: value }))
//             setValidInformation(prev => ({ ...prev, isIDChecked: false }))
//         }
//     }, [])

//     /** 비밀번호 확인 입력 event */
//     const handlePasswordCheckChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const value = e.target.value.trim()
//         setValidInformation(prev => ({ ...prev, checkSecretPw: value }))
//     }, [])

//     /** 아이디 중복확인 */
//     const onConfirmID = useCallback(() => {
//         useAxios(
//             {
//                 url: applyQueryString(API.USER_IDCHECK, { id: formItem.accessId }),
//                 method: HTTP_METHOD_GET,
//                 isLoading: false,
//             },
//             res => setValidInformation(prev => ({ ...prev, ...res, isIDChecked: true })),
//             (err: AxiosError) => {
//                 setOptions({
//                     type: ConfirmType.alert,
//                     message: err.message,
//                     buttonStyle: ButtonStyleType.default,
//                     applyButtonMessage: g("button.ok"),
//                 })
//                 setVisible(true)
//             }
//         )
//     }, [formItem.accessId])

//     /** 계정신청  */
//     const saveForm = useCallback(() => {
//         isValid(validator, (valid, errors) => {
//             if (valid) {
//                 setOptions({
//                     type: ConfirmType.success,
//                     message: g("confirm.onRegist"),
//                     buttonStyle: ButtonStyleType.primary,
//                     applyButtonMessage: g("button.regist"),
//                     onApply: () => {
//                         useAxios(
//                             {
//                                 url: API.USER_DETAIL,
//                                 param: {
//                                     ...formItem,
//                                     email: encodeURIComponent(formItem.email),
//                                     phone: encodeURIComponent(formItem.phone),
//                                     secretPw: encodeURIComponent(formItem.secretPw),
//                                     name: encodeURIComponent(formItem.name),
//                                 },
//                             },
//                             () => {
//                                 setOptions({
//                                     type: ConfirmType.alert,
//                                     message: i("signUp.beRegistered"),
//                                     buttonStyle: ButtonStyleType.default,
//                                     applyButtonMessage: g("button.ok"),
//                                 })
//                                 setVisible(true)
//                                 onClose()
//                             },
//                             (err: AxiosError) => {
//                                 setOptions({
//                                     type: ConfirmType.alert,
//                                     message: err.message,
//                                     buttonStyle: ButtonStyleType.default,
//                                     applyButtonMessage: g("button.ok"),
//                                 })
//                                 setVisible(true)
//                             }
//                         )
//                     },
//                 })
//                 setVisible(true)
//             } else {
//                 setOptions({
//                     type: ConfirmType.alert,
//                     message: v(`signup.${errors[0].key}`, { val: v(errors[0].message) }),
//                     buttonStyle: ButtonStyleType.default,
//                     applyButtonMessage: g("button.ok"),
//                 })
//                 setVisible(true)
//             }
//         })
//     }, [formItem, validInformation])

//     /** 계정신청 모달 하단요소 */
//     const modalFooterRenderer = useCallback(() => {
//         return (
//             <>
//                 <Button styleType={ButtonStyleType.confirm} onClick={() => saveForm()}>
//                     {g("button.signup")}
//                 </Button>
//                 <Button styleType={ButtonStyleType.default} onClick={() => onClose()}>
//                     {g("button.cancel")}
//                 </Button>
//             </>
//         )
//     }, [saveForm])

//     /** 계정신청 모달 상단요소 */
//     const modalHeaderRenderer = useCallback(() => {
//         return (
//             <>
//                 <h2>
//                     <AccountCircle className="modal-title-icon" />
//                     {i("signUp.title")}
//                 </h2>
//                 <p>{i("signUp.description")}</p>
//                 <Close className="close" onClick={() => onClose()} />
//             </>
//         )
//     }, [])

//     /** 에러메세지 */
//     const Error = useCallback(message => {
//         return (
//             <div className="error-message">
//                 <div> {message} </div>
//             </div>
//         )
//     }, [])

//     return (
//         <Modal classList={["add-modal modal-sign-up"]} headerRenderer={modalHeaderRenderer} footerRenderer={modalFooterRenderer}>
//             <form>
//                 <FormItem>
//                     <Label id="name" value={i("signUp.admin")} />
//                     <Input id="name" name="name" type="text" onChange={handleChange} required={true} value={formItem.name} />
//                 </FormItem>
//                 <FormItem customClassName={["user-id"]}>
//                     <Label id="id" value={i("signUp.id")} />
//                     <Input id="accessId" name="id" type="text" required={true} onChange={handleIdChange} value={formItem.accessId} />
//                     <Button type={"button"} styleType={ButtonStyleType.default} disabled={!formItem.accessId} onClick={onConfirmID}>
//                         {i("signUp.isValid")}
//                     </Button>
//                 </FormItem>
//                 {Error("영문 대 소문자, 숫자, 특수문자(@ . - _)를 사용하세요.")}
//                 {validInformation.isIDChecked && Error(v(validInformation.existYn ? "existId" : "validId"))}
//                 <FormItem>
//                     <Label id="password" value={i("signUp.password")} />
//                     <Input id="secretPw" name="password" type="password" onChange={handleChange} required={true} />
//                 </FormItem>
//                 {Error("8자 이상의 영문 대 소문자, 숫자, 특수문자를 사용하세요.")}
//                 <FormItem>
//                     <Label id="passwordCheck" value={i("signUp.passwordConfirm")} />
//                     <Input id="CheckSecretPw" name="passwordCheck" type="password" onChange={handlePasswordCheckChange} required={true} />
//                 </FormItem>
//                 <FormItem>
//                     <Label id="phone" value={i("signUp.phone")} />
//                     <Input id="phone" name="phone" type="tel" onChange={handlePhoneChange} required={true} value={formItem.phone} />
//                 </FormItem>
//                 <FormItem>
//                     <Label id="email" value={i("signUp.email")} />
//                     <Input id="email" name="email" type="email" onChange={handleChange} required={true} value={formItem.email} />
//                 </FormItem>
//                 <FormItem>
//                     <Label id="department" value={i("signUp.department")} />
//                     <Input id="department" name="department" type="text" onChange={handleChange} required={true} value={formItem.department} />
//                 </FormItem>
//             </form>
//         </Modal>
//     )
// }

// export default SignUp
