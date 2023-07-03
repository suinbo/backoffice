import React, { useEffect, useState, useCallback, useMemo, useRef } from "react"
import { Button, DeleteButton } from "@/components/ui/buttons"
import { ButtonStyleType, DeleteButtonType } from "@/components/ui/buttons/types"
import { BorderColor, Close } from "@material-ui/icons"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { MENUS, T_NAMESPACE,UX_CODES, VIEW_CODES } from "@/utils/resources/constants"
import Section2 from "./Section2"
import { useConfirm } from "@/contexts/ConfirmContext"
import { ConfirmType } from "@/components/ui/confirm/types"
import { useTranslation } from "react-i18next"
import { useRequest } from "@/contexts/SendApiContext"
import { PageCodeList } from "@/utils/apis/request.types"
import { API, HTTP_METHOD_DELETE, HTTP_METHOD_POST, HTTP_METHOD_PUT } from "@/utils/apis/request.const"
import { CurationDetailProp, CurationSectionData, DetailSelectBoxItem, ModalSelectBoxItem, RequestParams } from "./types"
import {
    CATEGORY,
    CHANNEL,
    CONTENT,
    defaultDetailData,
    defaultDetailItem,
    defaultModalItem,
    defaultSectionData,
    EPISODE_ALL,
    EPISODE_SINGLE,
    LIVE,
    SPECIAL,
} from "./const"
import { S3UploadFile, S3UploadResponse } from "@/utils/aws/types"
import { applyPath, applyQueryString } from "@/utils/apis/request"
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

    const [formItem, setFormItem] = useState<CurationDetailProp>({ ...defaultDetailData, sections: defaultSectionData })
    const [sectionData, setSectionData] = useState<CurationSectionData[]>(defaultSectionData)

    const [opSelectboxItems, setOpSelecBoxItems] = useState<DetailSelectBoxItem>(defaultDetailItem)
    const [sysSelectboxItems, setSysSelectBoxItems] = useState<ModalSelectBoxItem>(defaultModalItem)
    const [s3UploadFiles, setS3UploadFiles] = useState<Array<S3UploadFile>>([])

    const { isValid } = useValidate({ formItem, sectionItem: { sectionYn: formItem.sectionYn, sections: sectionData } })
    const refs = useRef<HTMLDivElement>(null)

    useEffect(() => setSectionData(formItem.sections.map(section => ({ ...section, open: true }))), [formItem.sections])

    /** 시스템 코드 조회 */
    useFetch<PageCodeList[]>(
        { url: `${API.SYSCODE_LIST}?uxId=${VIEW_CODES.MENU2}` },
        {
            onSuccess: (items: PageCodeList[]) => {
                !noId && setLoading(false)
                const contentTypes = items[0].leafs.find(leaf => leaf.value == "content").leafs
                setOpSelecBoxItems({
                    contentsType: contentTypes.map(item => ({ id: item.id, title: item.name, value: item.value }))
                })
            },
        }
    )

    /** 큐레이션 상세 조회 */
    useFetch<CurationDetailProp>(noId ? { url: applyPath(API.FAQ_DETAIL, noId) } : null, {
        onSuccess: (data: CurationDetailProp) => {
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
    }, [formItem, s3UploadFiles, sectionData])

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
    }, [formItem, sectionData])

    return (
        <div id="curationModal" ref={refs}>
            <div className="page-detail content-page-detail">
                <div className="detail-area">
                    <Section2
                        {...opSelectboxItems}
                        modalItems={sysSelectboxItems}
                        formItem={formItem}
                        setFormItem={setFormItem}
                        sectionData={sectionData}
                        setSectionData={setSectionData}
                    />
                    {/**더보기 상단 메타*/}
                    {/* <Section3
                        {...opSelectboxItems}
                        formItem={formItem}
                        setFormItem={setFormItem}
                        setS3UploadFiles={setS3UploadFiles}
                    /> */}
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
