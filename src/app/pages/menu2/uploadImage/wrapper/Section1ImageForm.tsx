import React, { useCallback, useMemo, useRef } from "react"
import FormItem, { FormGroup } from "@/components/ui/forms/FormItem"
import UploadFile from "@/components/ui/forms/UploadFile"
import {  S3_SERVICE_PREFIX, T_NAMESPACE, T_PREFIX } from "@/utils/resources/constants"
import { useTranslation } from "react-i18next"
import { CurationImageInfo, CurationDetailProp, CurationImageFormItem } from "../types"
import { AttachFile, HighlightOff } from "@material-ui/icons"
import { UploadFileProps, UploadImageProps } from "@/utils/resources/types"
import { uploadImage } from "@/utils/common"
import { S3UploadFile } from "@/utils/aws/types"
import { SPECIAL_MINIMUN_IMAGE } from "../const"
import { useConfirm } from "@/contexts/ConfirmContext"
import { ConfirmType } from "@/components/ui/confirm/types"
import { ButtonStyleType } from "@/components/ui/buttons/types"

/**
 * 섹션 1 이미지 
 * @param imageInfo 
 * @param formItem
 * @param setFormItem
 * @param setS3UploadFiles
 */
const POCImageForm = ({
    imageInfo,
    formItem,
    setFormItem,
    setS3UploadFiles,
}: {
    imageInfo: {
        imageList: Array<CurationImageInfo>
        imageType: string
    }
    formItem: CurationDetailProp
    setFormItem: React.Dispatch<React.SetStateAction<CurationDetailProp>>
    setS3UploadFiles: React.Dispatch<React.SetStateAction<Array<S3UploadFile>>>
}) => {
    const { t } = useTranslation(T_NAMESPACE.MENU2, { keyPrefix: T_PREFIX.CURATION })
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
    const { setVisible, setOptions } = useConfirm()
    const { imageList, imageType } = imageInfo

    /** 드래그할 아이템 인덱스 */
    const dragItem = useRef<number>()

    /** 드랍할 위치의 아이템의 인덱스  */
    const dragOverItem = useRef<number>()

    /** 섹션 별 이미지 아이템 */
    const sectionPocItem = useMemo(
        (): { [key: string]: CurationImageFormItem } => ({
            pocType: {
                formTitle: [t("appweb"), t("tv")],
                pocType: ["APP", "TV"],
                hasAppImage: formItem.pocs.includes("APP") || formItem.pocs.includes("WEB"),
                hasTvImage: formItem.pocs.includes("TV"),
                imageKey: "specialImages",
            },
        }),
        [formItem]
    )

    /** 이미지 개별 삭제 */
    const onDeleteImage = useCallback((image: CurationImageInfo) => {
        setS3UploadFiles(prev => prev.filter(item => item.key !== image.url))
        setFormItem((prev: CurationDetailProp) => ({
            ...prev,
            specialImages: imageList.filter(item => item !== image)
        }))
    }, [imageList])

    /** 드래그 시작 */
    const onDragStart = useCallback((index: number) => (dragItem.current = index - 1), [imageList])

    /** 드래그 */
    const onDragEnter = useCallback((index: number) => (dragOverItem.current = index - 1), [imageList])

    /** 드롭 */
    const onDrop = useCallback(
        (pocType?: string) => {
            const newList = [...imageList]
            const dragItemValue = newList[dragItem.current]
            newList.splice(dragItem.current, 1)
            newList.splice(dragOverItem.current, 0, dragItemValue)
            dragItem.current = null
            dragOverItem.current = null

            setFormItem(prev => ({
                ...prev,
                specialImages: newList.map((item, index) =>
                    item.pocType == pocType ? { ...item, orderNo: index + 1 } : item
                ),
            }))
        },
        [imageList]
    )

    /** 알럿 노출 */
    const onAlertOfImages = useCallback(() => {
        setOptions({
            type: ConfirmType.alert,
            message: g("alert.maximum2Images"),
            buttonStyle: ButtonStyleType.primary,
            applyButtonMessage: g("button.ok"),
        })
        setVisible(true)
    }, [])

    /** 이미지 첨부 */
    const onAttachFiles = useCallback(
        ({ id, fileList }: UploadFileProps) => {
            const isOverTwoImages = imageList.filter(image => image.pocType == id).length + fileList.length > SPECIAL_MINIMUN_IMAGE 

            // 이미지 2개 이상 시 알럿 노출
            if (isOverTwoImages) {
                onAlertOfImages()
                return
            }

            fileList.map(item => {
                uploadImage({ file: item, prefix: S3_SERVICE_PREFIX.curation }).then((res: UploadImageProps) => {
                    setFormItem(prev => {
                        setS3UploadFiles((prev: Array<S3UploadFile>) => {
                            const fileObj = { key: res.imgPath, file: item, option: id }
                            return [...prev, fileObj]
                        })

                        return { ...prev, 
                            specialImages: [
                                ...prev.specialImages, 
                                {
                                    orderNo: prev.specialImages.length + 1, 
                                    height: res.height,
                                    width: res.width,
                                    url: res.imgPath,
                                    previewImage: res.src,
                                    pocType: id,
                                }
                            ]
                        }
                    })
                })
            })
        },
        [imageList]
    )

    /** 이미지 첨부 레이아웃 */
    const imageElement = useCallback(
        (image: CurationImageInfo) =>
            image && (
                <div
                    key={image.orderNo}
                    className="box"
                    onDragStart={() => onDragStart(image.orderNo)}
                    onDragEnter={() => onDragEnter(image.orderNo)}
                    onDragEnd={() => onDrop(image.pocType)}
                    onDragOver={e => e.preventDefault()}
                    draggable>
                    <img className="image" id={image?.url} src={image?.previewImage ?? image?.domain + image?.url} />
                    <HighlightOff className="img-close" onClick={() => onDeleteImage(image)} />
                </div>
            ),

        [imageList]
    )

    /**
     * 이미지 영역
     **/
    const imageFileRenderer = useCallback(
        (type: string) => {
            const image = imageList.find(item => item.pocType == type)
            const renderList = imageList.filter(item => item.pocType == type)

            return (
                <div className="file-wrapper">
                    <div className="file-box">
                        <label htmlFor={type}>
                            <AttachFile />
                            {g("button.addFile")}
                        </label>
                        {<UploadFile id={type} onChange={onAttachFiles} multiUpload={true} />}
                    </div>
                    <div className="image-box multi">
                        {image ? (
                            renderList.map(image => imageElement(image))
                        ) : (
                            <div className="description">
                                <p>{t("minimum2Images")}</p>
                                <p>{t("dragNDropImages")}</p>
                            </div>
                        )}
                    </div>
                </div>
            )
        },
        [imageList]
    )

    return (
        <>
            {!!formItem.pocs.length && (
                <FormGroup title={t("image")} customClassName={["popup-image"]}>
                    {sectionPocItem[imageType].hasAppImage && (
                        <FormItem title={sectionPocItem[imageType].formTitle[0]}>
                            {imageFileRenderer(sectionPocItem[imageType].pocType[0])}
                        </FormItem>
                    )}
                    {sectionPocItem[imageType].hasTvImage && (
                        <FormItem title={sectionPocItem[imageType].formTitle[1]}>
                            {imageFileRenderer(sectionPocItem[imageType].pocType[1])}
                        </FormItem>
                    )}
                </FormGroup>
            )}
        </>
    )
}

export default POCImageForm
