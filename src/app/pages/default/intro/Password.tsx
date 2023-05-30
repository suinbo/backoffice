// import React, { useCallback, useState } from "react"
// import { Close, LockSharp } from "@material-ui/icons"
// import { Button } from "@/components/ui/buttons"
// import { ButtonStyleType } from "@/components/ui/buttons/types"
// import { useConfirm } from "@/contexts/ConfirmContext"
// import { ValidatorProp, ValidatorType } from "@/utils/resources/validators"
// import { useValidate } from "@/hooks/useValidate"
// import { ConfirmType } from "@/components/ui/confirm/types"
// import { useTranslation } from "react-i18next"
// import { T_NAMESPACE } from "@/utils/resources/constants"
// import { emailMasking } from "@/utils/common"
// import { useRequest } from "@/contexts/SendApiContext"
// import { API } from "@/utils/apis/request.const"
// import { TemporaryPasswordProp } from "./types"
// import Modal from "@/components/ui/modal"
// import FormItem from "@/components/ui/forms/FormItem"
// import Label from "@/components/ui/forms/Label"
// import Input from "@/components/ui/forms/Input"
// import "./styles.scss"
// import { AxiosError } from "axios"

// const defaultValue: TemporaryPasswordProp = {
//     id: "",
//     name: "",
//     email: "",
// }

// const validator: Array<ValidatorProp> = [
//     { key: "id", required: true, type: ValidatorType.text },
//     { key: "name", required: true, type: ValidatorType.text },
//     { key: "email", required: true, type: ValidatorType.email },
// ]

// export const TemporaryPassword = ({ onClose }: { onClose: () => void }) => {
//     const { t: v } = useTranslation(T_NAMESPACE.VALIDATE)
//     const { useAxios } = useRequest()
//     /**  폼아이템, 컨펌창, 유효성검사 */
//     const [formItem, setFormItem] = useState<TemporaryPasswordProp>({ ...defaultValue })
//     const { setVisible, setOptions } = useConfirm()
//     const { isValid } = useValidate<TemporaryPasswordProp>({ ...formItem })

//     /**  Change FormItem matched with own ID */
//     const handleOnChange = (e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => {
//         e.stopPropagation()
//         const { id, value } = e.target
//         setFormItem(prev => ({ ...prev, [id]: value }))
//     }

//     /** 확인 버튼 이벤트 */
//     const onConfirmClick = useCallback(() => {
//         isValid(validator, (valid, errors) => {
//             if (valid) {
//                 const param = {
//                     accessId: formItem.id,
//                     name: encodeURIComponent(formItem.name),
//                     email: encodeURIComponent(formItem.email),
//                 }
//                 useAxios(
//                     {
//                         url: API.TEMP_INFO_CHECK,
//                         param: param,
//                     },
//                     () => {
//                         setOptions({
//                             type: ConfirmType.success,
//                             message: "발급하시겠습니까?",
//                             buttonStyle: ButtonStyleType.primary,
//                             applyButtonMessage: "확인",
//                             onApply: () => {
//                                 useAxios(
//                                     {
//                                         url: API.TEMP_PASSWORD,
//                                         param: param,
//                                     },
//                                     () => {
//                                         setOptions({
//                                             type: ConfirmType.alert,
//                                             message: `임시 비밀번호가 발급되었습니다. \n이메일(${emailMasking(formItem.email)})을 확인해 주세요.`,
//                                             applyButtonMessage: "확인",
//                                             onApply: () => onClose(),
//                                         })
//                                         setVisible(true)
//                                     },
//                                     (err: AxiosError) => {
//                                         setOptions({
//                                             type: ConfirmType.alert,
//                                             message: err.message,
//                                             buttonStyle: ButtonStyleType.default,
//                                             applyButtonMessage: "확인",
//                                         })
//                                         setVisible(true)
//                                     }
//                                 )
//                             },
//                         })
//                         setVisible(true)
//                     },
//                     (err: AxiosError) => {
//                         setOptions({
//                             type: ConfirmType.alert,
//                             message: err.message,
//                             buttonStyle: ButtonStyleType.default,
//                             applyButtonMessage: "확인",
//                         })
//                         setVisible(true)
//                     }
//                 )
//             } else {
//                 setOptions({
//                     type: ConfirmType.alert,
//                     message: v(`userInfo.${errors[0].key}`, { val: v(errors[0].message) }),
//                     buttonStyle: ButtonStyleType.default,
//                     applyButtonMessage: "확인",
//                 })
//                 setVisible(true)
//             }
//         })
//     }, [isValid])

//     /** 모달 헤더 */
//     const modalHeaderRenderer = useCallback(() => {
//         return (
//             <>
//                 <h2>
//                     <LockSharp className="modal-title-icon" /> 임시 비밀번호 발급
//                 </h2>
//                 <p>
//                     * 계정신청시 입력하셨던 계정정보를 정확히 입력해주세요. <br />
//                     * 정보가 일치하지 않을시 임시비밀번호 발급이 불가합니다. <br />* 임시비밀번호는 입력하신 이메일을 통해 발급됩니다.
//                 </p>
//                 <Close className="close" onClick={() => onClose()} />
//             </>
//         )
//     }, [])

//     /** 모달 풋터 */
//     const modalFooterRenderer = useCallback(() => {
//         return (
//             <>
//                 <Button styleType={ButtonStyleType.confirm} onClick={onConfirmClick}>
//                     확인
//                 </Button>
//                 <Button styleType={ButtonStyleType.default} onClick={() => onClose()}>
//                     취소
//                 </Button>
//             </>
//         )
//     }, [onConfirmClick])

//     return (
//         <Modal classList={["add-modal modal-temporary-password"]} headerRenderer={modalHeaderRenderer} footerRenderer={modalFooterRenderer}>
//             <FormItem>
//                 <Label id="name" value="관리자명" />
//                 <Input id="name" type="text" onChange={handleOnChange} value={formItem.name} />
//             </FormItem>
//             <FormItem>
//                 <Label id="id" value="아이디" />
//                 <Input id="id" type="text" onChange={handleOnChange} value={formItem.id} />
//             </FormItem>
//             <FormItem>
//                 <Label id="email" value="이메일" />
//                 <Input id="email" type="text" onChange={handleOnChange} value={formItem.email} />
//             </FormItem>
//         </Modal>
//     )
// }

// export default TemporaryPassword
