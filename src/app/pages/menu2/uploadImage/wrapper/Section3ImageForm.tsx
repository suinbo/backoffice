import React, { useCallback, useMemo, useRef } from "react"
import FormItem from "@/components/ui/forms/FormItem"
import UploadFile from "@/components/ui/forms/UploadFile"
import {  S3_SERVICE_PREFIX, T_NAMESPACE, T_PREFIX } from "@/utils/resources/constants"
import { useTranslation } from "react-i18next"
import { SectionImageProp, ImageOfSectionTypeProp, ImageProp } from "../types"
import { CONTENT_IMAGE_TYPE, LINK, UPLOAD } from "../const"
import { AttachFile, HighlightOff } from "@material-ui/icons"
import { UploadFileProps, UploadImageProps } from "@/utils/resources/types"
import { uploadImage } from "@/utils/common"
import { S3UploadFile } from "@/utils/aws/types"

/**
 * 섹션 3 이미지 
 * @param imageInfo 
 * @param formItem
 * @param setFormItem
 * @param setS3UploadFiles
 */
const Section3ImageForm = ({
    imageInfo,
    formItem,
    setFormItem,
    setS3UploadFiles,
}: {
    imageInfo: {
        imageList: Array<ImageProp>
        imageType: string
    }
    formItem: SectionImageProp
    setFormItem: React.Dispatch<React.SetStateAction<SectionImageProp>>
    setS3UploadFiles: React.Dispatch<React.SetStateAction<Array<S3UploadFile>>>
}) => {
    const { t } = useTranslation(T_NAMESPACE.MENU2, { keyPrefix: T_PREFIX.CURATION })
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
    const { imageList, imageType } = imageInfo

    /** 드래그할 아이템 인덱스 */
    const dragItem = useRef<number>()

    /** 드랍할 위치의 아이템의 인덱스  */
    const dragOverItem = useRef<number>()

    /** 라벨 아이템 */
    const labelItem = useMemo(
        () => [
            { id: `${UPLOAD}_${imageType}`, title: g("label.upLoad"), value: UPLOAD },
            { id: `${LINK}_${imageType}`, title: g("label.link"), value: LINK },
        ],
        []
    )

    /** 섹션 별 이미지 아이템 */
    const sectionPocItem = useMemo(
        (): { [key: string]: ImageOfSectionTypeProp } => ({
            singleType: {
                formTitle: t("image"),
                labelList: labelItem.slice(0, 1).map(item => ({ ...item, id: UPLOAD })),
            },
        }),
        [formItem]
    )

    /** 이미지 개별 삭제 */
    const onDeleteImage = useCallback((image: ImageProp) => {
        setS3UploadFiles(prev => prev.filter(item => item.key !== image.url))
        setFormItem((prev: SectionImageProp) => ({
            ...prev,
            section3Images: imageList.filter(item => item !== image)
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
                section3Images: newList.map((item, index) =>
                    item.pocType == pocType ? { ...item, orderNo: index + 1 } : item
                ),
            }))
        },
        [imageList]
    )

    /** 이미지 첨부 */
    const onAttachFiles = useCallback(
        ({ id, fileList }: UploadFileProps) => {

            fileList.map(item => {
                uploadImage({ file: item, prefix: S3_SERVICE_PREFIX.curation }).then((res: UploadImageProps) => {
                    setFormItem(prev => {
                        const list: { [key: string]: ImageProp[] } = {
                            singleType: prev.section3Images,
                        }

                        setS3UploadFiles((prev: Array<S3UploadFile>) => {
                            const fileObj = { key: res.imgPath, file: item, option: id }
                            return [...prev.filter(item => item.key !== res.imgPath), fileObj]
                        })
                        
                        const section3Images = {
                            orderNo: list[imageType].length + 1,
                            url: res.imgPath,
                            width: res.width,
                            height: res.height,
                            previewImage: res.src,
                        }

                        return {
                            ...prev,
                            section3Images: [...list[imageType], section3Images],
                        }
                    })
                })
            })
        },
        [imageList]
    )

    /** 이미지 첨부 레이아웃 */
    const imageElement = useCallback(
        (image: ImageProp) =>
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

            return (
                <div className="file-wrapper">
                    <>
                        <div className="file-box">
                            <label htmlFor={type}>
                                <AttachFile />
                                {g(`button.${!image?.url ? "addFile" : "modifyFile"}`)}
                            </label>
                            {<UploadFile id={type} onChange={onAttachFiles} multiUpload={true} />}
                        </div>
                        <div className="image-box multi">
                            {image || imageList.length ? (
                                imageList?.map(image => imageElement(image))
                            ) : (
                                <div className="description">
                                    <p>{t("minimum5Images")}</p>
                                    <p>{t("dragNDropImages")}</p>
                                </div>
                            )}
                        </div>
                    </>
                </div>
            )
        },
        [imageList]
    )

    return (
        <FormItem title={sectionPocItem[imageType].formTitle as string}>
            {imageFileRenderer(CONTENT_IMAGE_TYPE)}
        </FormItem>
    )
}

export default Section3ImageForm
