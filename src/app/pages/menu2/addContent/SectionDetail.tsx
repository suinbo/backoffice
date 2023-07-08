import React, { useEffect, useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/buttons"
import { ButtonStyleType } from "@/components/ui/buttons/types"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { MENUS, T_NAMESPACE, VIEW_CODES } from "@/utils/resources/constants"
import SectionForm from "./SectionForm"
import { useConfirm } from "@/contexts/ConfirmContext"
import { ConfirmType } from "@/components/ui/confirm/types"
import { useTranslation } from "react-i18next"
import { useRequest } from "@/contexts/SendApiContext"
import { PageCodeList } from "@/utils/apis/request.types"
import { API, HTTP_METHOD_POST, HTTP_METHOD_PUT } from "@/utils/apis/request.const"
import { CurationDetailProp, CurationSectionData, DetailSelectBoxItem } from "./types"
import {
    defaultDetailData,
    defaultDetailItem,
    defaultSectionData,
} from "./const"
import { applyPath } from "@/utils/apis/request"
import { useValidate } from "@/hooks/useValidate"
import { ValidatorProp } from "@/utils/resources/validators"
import { AxiosError } from "axios"
import { LoadingProvider, useLoading } from "@/contexts/LoadingContext"
import "./styles.scss"

const validator: Array<ValidatorProp> = [{
 key: ""
}]

/**
 * 큐레이션 상세 Component
 */
const SectionDetail = () => {
    const { noId } = useParams()
    const { state } = useLocation()
    const navigate = useNavigate()
    const { useFetch, useAxios } = useRequest()
   
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
    const { t: v } = useTranslation(T_NAMESPACE.VALIDATE)
    const { setVisible, setOptions } = useConfirm()
    const { setLoading } = useLoading()

    const [formItem, setFormItem] = useState<CurationDetailProp>({ ...defaultDetailData, sections: defaultSectionData })
    const [sectionData, setSectionData] = useState<CurationSectionData[]>(defaultSectionData)
    const [opSelectboxItems, setOpSelecBoxItems] = useState<DetailSelectBoxItem>(defaultDetailItem)

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
                const pSearchTypes = items[0].leafs.find(leaf => leaf.value == "programsearch").leafs
                const eSearchTypes = items[0].leafs.find(leaf => leaf.value == "episodesearch").leafs

                setOpSelecBoxItems({
                    contentsType: contentTypes.map(item => ({ id: item.id, title: item.name, value: item.value })),
                    pSearchType: pSearchTypes.map(item => ({ label: item.name, value: item.value })),
                    eSearchType: eSearchTypes.map(item => ({ label: item.name, value: item.value })),
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
    }, [formItem, sectionData])

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
        <div id="cms02Detail" ref={refs}>
            <div className="page-detail content-page-detail">
                <div className="detail-area">
                    <SectionForm
                        {...opSelectboxItems}
                        modalItems={opSelectboxItems}
                        formItem={formItem}
                        setFormItem={setFormItem}
                        sectionData={sectionData}
                        setSectionData={setSectionData}
                    />
                </div>
                <FooterRenderer />
            </div>
        </div>
    )
}

const SectionDetailWrapper = () => {
    return (
        <LoadingProvider>
            <SectionDetail />
        </LoadingProvider>
    )
}

export default React.memo(SectionDetailWrapper)
