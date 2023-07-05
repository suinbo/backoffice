import React, { useState, useCallback, useMemo, useRef } from "react"
import { Button, DeleteButton } from "@/components/ui/buttons"
import { ButtonStyleType, DeleteButtonType } from "@/components/ui/buttons/types"
import { BorderColor } from "@material-ui/icons"
import Section3 from "./section/Section3"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import Navigation, { NavItem } from "@/components/ui/forms/Navigation"
import { MENUS, T_NAMESPACE, VIEW_CODES } from "@/utils/resources/constants"
import Section1 from "./section/Section1"
import Section2 from "./section/Section2"
import { useConfirm } from "@/contexts/ConfirmContext"
import { ConfirmType } from "@/components/ui/confirm/types"
import { useTranslation } from "react-i18next"
import { useRequest } from "@/contexts/SendApiContext"
import { PageCodeList } from "@/utils/apis/request.types"
import { API, HTTP_METHOD_DELETE, HTTP_METHOD_POST, HTTP_METHOD_PUT } from "@/utils/apis/request.const"
import { SectionImageProp, SystemCodeItemProp } from "./types"
import { defaultDetailData, defaultSystemCodeData } from "./const"
import { S3UploadFile, S3UploadResponse } from "@/utils/aws/types"
import { applyPath } from "@/utils/apis/request"
import { useValidate } from "@/hooks/useValidate"
import { ValidatorProp } from "@/utils/resources/validators"
import { s3Client } from "@/plugins/s3"
import { AxiosError } from "axios"
import { LoadingProvider, useLoading } from "@/contexts/LoadingContext"
import "./styles.scss"

const validator: Array<ValidatorProp> = [{
 key: ""
}]

/**
 * 큐레이션 상세 Component
 */
const CurationDetail = () => {
    const { noId } = useParams()
    const { state } = useLocation()
    const navigate = useNavigate()
    const { useFetch, useAxios } = useRequest()
   
    const { t } = useTranslation(T_NAMESPACE.MENU2)
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
    const { t: v } = useTranslation(T_NAMESPACE.VALIDATE)
    const { setVisible, setOptions } = useConfirm()
    const { setLoading } = useLoading()

    const [formItem, setFormItem] = useState<SectionImageProp>(defaultDetailData)
    const [systemCodeItems, setSystemCodeItems] = useState<SystemCodeItemProp>(defaultSystemCodeData)
    const [s3UploadFiles, setS3UploadFiles] = useState<Array<S3UploadFile>>([])

    const { isValid } = useValidate(formItem)
    const refs = useRef<HTMLDivElement>(null)

    /** 시스템 코드 조회 */
    useFetch<PageCodeList[]>(
        { url: `${API.SYSCODE_LIST}?uxId=${VIEW_CODES.MENU2}` },
        {
            onSuccess: (items: PageCodeList[]) => {
                !noId && setLoading(false)

                const imageTypes = items[0].leafs.find(leaf => leaf.value == "image").leafs
                const contentTypes = items[0].leafs.find(leaf => leaf.value == "content").leafs

                setSystemCodeItems({
                    imageType: imageTypes.map(item => ({ isChecked: true, label: item.name, value: item.value })),
                    contentsType: contentTypes.map(item => ({ id: item.id, title: item.name, value: item.value }))
                })
            },
        }
    )

    /** 큐레이션 상세 조회 */
    useFetch<SectionImageProp>(noId ? { url: applyPath(API.FAQ_DETAIL, noId) } : null, {
        onSuccess: (data: SectionImageProp) => {
            setLoading(false)
            setFormItem(prev => ({ ...prev, ...data }))
        },
    })

    /** Hide Modal */
    const onClose = useCallback(() => navigate(MENUS.FAQ, { state }), [])

    /** 수정/등록 */
    const onSave = useCallback(() => {
        isValid(validator, valid => {
            if (valid) {
                setOptions({
                    type: ConfirmType.success,
                    message: g("confirm.onSave"),
                    buttonStyle: ButtonStyleType.primary,
                    applyButtonMessage: g("button.save"),
                    onApply: () => {
                        if (s3UploadFiles.length) {
                            s3Client()
                                .multiUpload(
                                    {
                                        //bucket: process.env.BUCKET,
                                        bucket: "",
                                        files: s3UploadFiles,
                                    },
                                    (res: S3UploadResponse[]) => {
                                        const successData = res.filter(item => item.code)
                                        const failCnt = res.length - successData.length
                                        if (failCnt > 0) {
                                            setOptions({
                                                type: ConfirmType.alert,
                                                message: failCnt
                                                    ? g("alert.uploadCheck", {
                                                          val1: res.filter(item => item.code).length,
                                                          val2: failCnt,
                                                      })
                                                    : g("alert.imageNotice"),
                                                buttonStyle: ButtonStyleType.default,
                                                applyButtonMessage: g("button.ok"),
                                            })
                                            setVisible(true)
                                        } else {
                                            useAxios(
                                                {
                                                    url: noId ? applyPath(API.FAQ_DETAIL, noId) : API.FAQ_DETAIL,
                                                    param: formItem,
                                                    method: noId ? HTTP_METHOD_PUT : HTTP_METHOD_POST,
                                                },
                                                () => onClose(),
                                                (err: AxiosError) => {
                                                    setOptions({
                                                        type: ConfirmType.alert,
                                                        message: err.message,
                                                        buttonStyle: ButtonStyleType.default,
                                                        applyButtonMessage: g("button.ok"),
                                                    })
                                                    setVisible(true)
                                                }
                                            )
                                        }
                                    }
                                )
                                .catch((err: Error) => {
                                    setOptions({
                                        type: ConfirmType.alert,
                                        message: err.message,
                                        buttonStyle: ButtonStyleType.default,
                                        applyButtonMessage: g("button.ok"),
                                    })
                                    setVisible(true)
                                })
                        } else {
                            useAxios(
                                {
                                    url: noId ? applyPath(API.FAQ_DETAIL, noId) : API.FAQ_DETAIL,
                                    param: formItem,
                                    method: noId ? HTTP_METHOD_PUT : HTTP_METHOD_POST,
                                },
                                () => onClose(),
                                (err: AxiosError) => {
                                    setOptions({
                                        type: ConfirmType.alert,
                                        message: err.message,
                                        buttonStyle: ButtonStyleType.default,
                                        applyButtonMessage: g("button.ok"),
                                    })
                                    setVisible(true)
                                }
                            )
                        }
                    },
                })
                setVisible(true)
            } else {
                setOptions({
                    type: ConfirmType.alert,
                    message: v("inValidAll"),
                    buttonStyle: ButtonStyleType.default,
                    applyButtonMessage: g("button.ok"),
                })
                setVisible(true)
            }
        })
    }, [formItem, s3UploadFiles])

    /** 삭제 */
    const onDelete = useCallback(() => {
        useAxios(
            {
                url: applyPath(API.FAQ_DETAIL, noId),
                method: HTTP_METHOD_DELETE,
            },
            onClose,
            (err: AxiosError) => {
                setOptions({
                    type: ConfirmType.alert,
                    message: err.message,
                    buttonStyle: ButtonStyleType.default,
                    applyButtonMessage: g("button.ok"),
                })
                setVisible(true)
            }
        )
    }, [])

    const titleWrapper = useMemo(
        () => (
            <>
                {noId && <h4>{g("editPost")}</h4>}
                {noId && <DeleteButton type={DeleteButtonType.Button} buttonProp={{ border: true }} onClick={onDelete} />}
            </>
        ),
        [noId]
    )

    /** Modal Header */
    const HeaderRenderer = useCallback(() => {
        return (
            <div className="content-detail-title">
                <h2>
                    <BorderColor className="modal-title-icon writing-icon" />
                    {t("sectionImages")}
                </h2>
            </div>
        )
    }, [])

    /** Modal Footer */
    const FooterRenderer = useCallback(() => {
        return (
            <div className="button-group">
                <Button styleType={ButtonStyleType.primary} onClick={onSave}>
                    {g("button.save")}
                </Button>
                <Button styleType={ButtonStyleType.default} onClick={onClose}>
                    {g("button.cancel")}
                </Button>
            </div>
        )
    }, [formItem])

    const naviItem = useMemo<Array<NavItem>>(
        () => [1,2,3].map(index => ({ link: `section${index}`, title: t(`section${index}`) })),
        [formItem]
    )

    return (
        <div id="curationModal" ref={refs}>
            <div className="page-detail content-page-detail">
                <HeaderRenderer />
                <div className="detail-title">{titleWrapper}</div>
                <div className="detail-area">
                    <Navigation item={naviItem} refProps={{ pageRef: refs }} />
                    <Section1
                        {...systemCodeItems}
                        formItem={formItem}
                        setFormItem={setFormItem}
                        setS3UploadFiles={setS3UploadFiles}
                    />
                    <Section2
                        {...systemCodeItems}
                        formItem={formItem}
                        setFormItem={setFormItem}
                        setS3UploadFiles={setS3UploadFiles}
                    />
                    <Section3
                        {...systemCodeItems}
                        formItem={formItem}
                        setFormItem={setFormItem}
                        setS3UploadFiles={setS3UploadFiles}
                    />
                </div>
                <FooterRenderer />
            </div>
        </div>
    )
}

const CurationDetailWrapper = () => {
    return (
        <LoadingProvider>
            <CurationDetail />
        </LoadingProvider>
    )
}

export default React.memo(CurationDetailWrapper)
