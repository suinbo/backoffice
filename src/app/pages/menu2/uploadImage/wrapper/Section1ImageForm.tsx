import React, { useCallback, useMemo, useRef } from "react"
import FormItem, { FormGroup } from "@/components/ui/forms/FormItem"
import UploadFile from "@/components/ui/forms/UploadFile"
import {  S3_SERVICE_PREFIX, T_NAMESPACE, T_PREFIX } from "@/utils/resources/constants"
import { useTranslation } from "react-i18next"
import { CurationImageInfo, CurationDetailProp, CurationImageFormItem, CurationIamgeRenderType } from "../types"
import { CONTENT_IMAGE_TYPE } from "../const"
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
        const key = sectionPocItem[imageType].imageKey
        const getFilteredList = (list: CurationImageInfo[]) => {
            const removedList = list.filter(item => item.url !== image.url)

                const pocOrderedList = (poc: string) =>
                    removedList.filter(item => item.pocType == poc).map((item, index) => ({ ...item, orderNo: index + 1 }))
                return [...pocOrderedList("APP"), ...pocOrderedList("TV")]
            
        }

        setS3UploadFiles(prev => prev.filter(item => item.key !== image.url))
        setFormItem((prev: CurationDetailProp) => ({
            ...prev,
            [key]: getFilteredList(prev[key] as CurationImageInfo[]),
        }))
    }, [])

    /** 드래그 시작 */
    const onDragStart = useCallback((index: number) => (dragItem.current = index - 1), [imageList])

    /** 드래그 */
    const onDragEnter = useCallback((index: number) => (dragOverItem.current = index - 1), [imageList])

    /** 드롭 */
    const onDrop = useCallback(
        (imageType: string, pocType?: string) => {
            const newList = [...imageList]
            const dragItemValue = newList[dragItem.current]
            newList.splice(dragItem.current, 1)
            newList.splice(dragOverItem.current, 0, dragItemValue)
            dragItem.current = null
            dragOverItem.current = null

            setFormItem(prev => ({
                ...prev,
                [sectionPocItem[imageType].imageKey]: newList.map((item, index) =>
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
            const appImagesLength = formItem.specialImages?.filter(image => image.pocType == "APP").length
            const isOverTwoImages = id == "APP" && imageType == "pocType" && fileList.length + appImagesLength > SPECIAL_MINIMUN_IMAGE
            const isOverSpecialImages = id == "APP" && appImagesLength == SPECIAL_MINIMUN_IMAGE

            //[스페셜관 강조] 이미지 2개 이상 시 알럿 노출
            if (isOverSpecialImages) {
                onAlertOfImages()
                return
            }

            if (isOverTwoImages) onAlertOfImages()

            const imageFileList = isOverTwoImages ? fileList.slice(0, SPECIAL_MINIMUN_IMAGE - appImagesLength) : fileList

            imageFileList.map(item => {
                uploadImage({ file: item, prefix: S3_SERVICE_PREFIX.curation }).then((res: UploadImageProps) => {
                    setFormItem(prev => {
                        const list: { [key: string]: CurationImageInfo[] } = {
                            pocType: prev.specialImages,
                        }


                        setS3UploadFiles((prev: Array<S3UploadFile>) => {
                            const fileObj = { key: res.imgPath, file: item, option: id }
                            const uploadFiles: { [key: string]: S3UploadFile[] } = {
                                pocType:
                                    id == "APP"
                                        ? [...prev.filter(item => item.key !== res.imgPath), fileObj]
                                        : [...prev.filter(item => item.option !== id), fileObj],
                            }

                            return uploadFiles[imageType]
                        })

                        const hasTvImage = !!list[imageType].find(item => item.pocType == "TV")
                        const specialImages = {
                            orderNo: list[imageType]?.filter(item => item.pocType == id).length + 1,
                            pocType: id,
                            url: res.imgPath,
                            width: res.width,
                            height: res.height,
                            previewImage: res.src,
                        }

                        //TV 일 경우
                        if (id == "TV" && hasTvImage) {
                            list[imageType].map(item => {
                                if (item.pocType == "TV") {
                                    item.url = res.imgPath
                                    item.width = res.width
                                    item.height = res.height
                                    item.previewImage = res.src
                                }
                                return item
                            })
                            return { ...prev }
                        }
                        return {
                            ...prev,
                            specialImages: [...list[imageType], specialImages],
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
                    onDragEnd={() => onDrop(imageType, image.pocType)}
                    onDragOver={e => e.preventDefault()}
                    draggable>
                    <img className="image" id={image?.url} src={image?.previewImage ?? image?.domain + image?.url} />
                    {image?.pocType !== "TV" && <HighlightOff className="img-close" onClick={() => onDeleteImage(image)} />}
                </div>
            ),

        [imageList]
    )

    /**
     * 이미지 영역
     * @desc APP,WEB : 2개 이상 등록
     * @desc VERTICAL,HORIZONTAL,TV : 1개만 등록
     * */
    const imageFileRenderer = useCallback(
        (type: string) => {
            const image = imageList?.find(item => item[imageType] == type)

            // 이미지 렌더 타입
            const rendererType: { [key: string]: CurationIamgeRenderType } = {
                pocType: {
                    renderElement: imageElement(image),
                    isMultiUpload: true,
                    description: { APP: t("minimum2Images"), TV: t("minimum1Image") },
                },
            }
            const { renderElement, isMultiUpload, description } = rendererType[imageType]
            const isSpecialTvType = isMultiUpload && type !== "TV"

            return (
                <div className="file-wrapper">
                    <>
                        <div className="file-box">
                            <label htmlFor={type}>
                                <AttachFile />
                                {g(`button.${!image?.url || isSpecialTvType ? "addFile" : "modifyFile"}`)}
                            </label>
                            {<UploadFile id={type} onChange={onAttachFiles} multiUpload={isSpecialTvType} />}
                        </div>
                        {isMultiUpload ? (
                            <div className="image-box multi">
                                {image || (type == CONTENT_IMAGE_TYPE && imageList.length) ? (
                                    renderElement
                                ) : (
                                    <div className="description">
                                        <p>{description[type]}</p>
                                        {isSpecialTvType && <p>{t("dragNDropImages")}</p>}
                                    </div>
                                )}
                            </div>
                        ) : (
                            renderElement
                        )}
                    </>
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
