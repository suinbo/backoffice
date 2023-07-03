import React, { useCallback, useMemo } from "react"
import FormItem, { FormGroup } from "@/components/ui/forms/FormItem"
import UploadFile from "@/components/ui/forms/UploadFile"
import { S3_SERVICE_PREFIX, T_NAMESPACE, T_PREFIX } from "@/utils/resources/constants"
import { useTranslation } from "react-i18next"
import { CurationImageInfo, CurationDetailProp, CurationImageFormItem, CurationIamgeRenderType } from "../types"
import { CONTENT_IMAGE_TYPE, HORIZONTAL, LINK, UPLOAD, VERTICAL } from "../const"
import Radio from "@/components/ui/forms/Radio"
import { AttachFile } from "@material-ui/icons"
import TextLink from "@/components/ui/forms/TextLink"
import Input from "@/components/ui/forms/Input"
import { UploadFileProps, UploadImageProps } from "@/utils/resources/types"
import { uploadImage } from "@/utils/common"
import { S3UploadFile } from "@/utils/aws/types"

/**
 * 섹션 2 이미지
 * @param imageInfo 
 * @param formItem
 * @param setFormItem
 * @param setS3UploadFiles
 */
const Section2ImageForm = ({
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
    const { imageList, imageType } = imageInfo

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
        (): { [key: string]: CurationImageFormItem } => ({
            directionType: {
                formTitle: [t("vertical"), t("horizon")],
                pocType: [VERTICAL, HORIZONTAL],
                labelList: labelItem,
                hasAppImage: formItem.pocs.includes("APP"),
                hasTvImage: formItem.pocs.includes("APP") || formItem.pocs.includes("WEB") || formItem.pocs.includes("TV"),
            },
        }),
        [formItem]
    )

    /** URL 타입 라디오 아이템 */
    const getUrlType = useCallback(
        (index: number) => {
            const hasImageType = imageList.find(item => item[imageType] == sectionPocItem[imageType].pocType[index])
            return `${hasImageType?.urlType ?? UPLOAD}_${imageType}`
        },

        [formItem, imageInfo]
    )

    /** URL 입력 */
    const onChangeInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { id, value } = e.target

            setFormItem(prev => {
                const images = prev.images.map(item => {
                    if (item[imageType] == id) {
                        item.url = value
                    }
                    return item
                })

                return { ...prev, images }
            })
        },
        [formItem]
    )

    /** 이미지 타입 변경 */
    const onChangeRadio = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target

            if (value == LINK) setS3UploadFiles(prev => prev.filter(item => item.option !== name))

            setFormItem(prev => {
                const hasType = !!prev.images.find(item => item.directionType == name)
                if (hasType) {
                    prev.images.map(item => {
                        if (item.directionType == name) {
                            item.urlType = value
                            item.url = ""
                            item.height = 0
                            item.width = 0
                            item.previewImage = ""
                        }
                        return item
                    })
                    return { ...prev }
                } else {
                    return {
                        ...prev,
                        images: [
                            ...prev.images,
                            {
                                urlType: value,
                                directionType: name,
                                url: "",
                                height: 0,
                                width: 0,
                                previewImage: "",
                            },
                        ],
                    }
                }
            })
        },
        [formItem]
    )

    /** 이미지 첨부 */
    const onAttachFiles = useCallback(
        ({ id, fileList }: UploadFileProps) => {
            fileList.map(item => {
                uploadImage({ file: item, prefix: S3_SERVICE_PREFIX.curation }).then((res: UploadImageProps) => {
                    setFormItem(prev => {
                        const list: { [key: string]: CurationImageInfo[] } = {
                            pocType: prev.specialImages,
                            directionType: prev.images,
                            singleType: prev.contentImages,
                        }

                        setS3UploadFiles((prev: Array<S3UploadFile>) => {
                            const fileObj = { key: res.imgPath, file: item, option: id }
                            const uploadFiles: { [key: string]: S3UploadFile[] } = {
                                directionType: [...prev.filter(item => item.option !== id), fileObj],
                            }

                            return uploadFiles[imageType]
                        })

                       
                        const hasType = list[imageType].find(item => item.directionType == id)
                        const addImages = {
                            directionType: id,
                            urlType: UPLOAD,
                            url: res.imgPath,
                            width: res.width,
                            height: res.height,
                            previewImage: res.src,
                        }

                        if (hasType) {
                            list[imageType].map(item => {
                                if (item[imageType] == id) {
                                    item.url = res.imgPath
                                    item.width = res.width
                                    item.height = res.height
                                    item.previewImage = res.src
                                    item.domain = ""
                                }
                                return item
                            })
                            return { ...prev }
                        } else {
                            return { ...prev, images: [...list[imageType], addImages] }
                        }
                            
                    })
                })
            })
        },
        [imageList]
    )

    /** 이미지 정보 영역 */
    const imageInfoRenderer = useCallback((image: CurationImageInfo) => {
        return (
            <>
                <TextLink value={(image.domain ?? "") + image.url} active={true} />
                <p className="image-size">{g("imageSize", { val: `${image.width} x ${image.height}` })}</p>
                <div className="image-box">
                    <img src={image.previewImage ?? image?.domain + image.url} className="image" />
                </div>
            </>
        )
    }, [])

    /**
     * 이미지 영역
     * @desc APP,WEB : 2개 이상 등록
     * @desc VERTICAL,HORIZONTAL,TV : 1개만 등록
     * */
    const imageFileRenderer = useCallback(
        (type: string) => {
            const image = imageList?.find(item => item[imageType] == type)
            const hasLinkUrlType = image?.urlType == LINK

            // 이미지 렌더 타입
            const rendererType: { [key: string]: CurationIamgeRenderType } = {
                directionType: {
                    renderElement: image?.url && imageInfoRenderer(image),
                    isMultiUpload: false,
                },
            }
            const { renderElement, isMultiUpload, description } = rendererType[imageType]

            return (
                <div className="file-wrapper">
                    {hasLinkUrlType ? (
                        <Input id={type} type="text" onChange={onChangeInput} value={image?.url} placeholder="URL" />
                    ) : (
                        <>
                            <div className="file-box">
                                <label htmlFor={type}>
                                    <AttachFile />
                                    {g(`button.${!image?.url ? "addFile" : "modifyFile"}`)}
                                </label>
                               <UploadFile id={type} onChange={onAttachFiles} />
                            </div>
                            {isMultiUpload ? (
                                <div className="image-box multi">
                                    {image || (type == CONTENT_IMAGE_TYPE && imageList.length) ? (
                                        renderElement
                                    ) : (
                                        <div className="description">
                                            <p>{description[type]}</p>
                                            <p>{t("dragNDropImages")}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                renderElement
                            )}
                        </>
                    )}
                </div>
            )
        },
        [imageList]
    )

    return (
        <>
            <FormGroup title={t("image")} customClassName={["popup-image", "top-line"]}>
                <FormItem title={sectionPocItem[imageType].formTitle[0]}>
                    <Radio
                        name={sectionPocItem[imageType].pocType[0]}
                        list={sectionPocItem[imageType].labelList}
                        data={getUrlType(0)}
                        onChange={onChangeRadio}
                    />
                    {imageFileRenderer(sectionPocItem[imageType].pocType[0])}
                </FormItem>
                <FormItem title={sectionPocItem[imageType].formTitle[1]}>
                    <Radio
                        name={sectionPocItem[imageType].pocType[1]}
                        list={sectionPocItem[imageType].labelList}
                        data={getUrlType(1)}
                        onChange={onChangeRadio}
                    />
                    {imageFileRenderer(sectionPocItem[imageType].pocType[1])}
                </FormItem>
            </FormGroup>
        </>
    )
}

export default Section2ImageForm
