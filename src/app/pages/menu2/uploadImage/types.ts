import { CheckItemBySelectBox } from "@/components/ui/forms/types"
import { RadioProps } from "@/components/ui/forms/Radio"

/** 섹션 별 이미지 */
export type SectionImageProp = {
    imageType: string[]
    contentsType: string
    imageYn?: boolean //이미지 사용여부
    section1Images?: Array<ImageProp> //섹션 1 이미지
    section2Images?: Array<ImageProp> //섹션 2 이미지
    section3Images?: Array<ImageProp> //섹션 3 이미지
}

export type ImageProp = {
    [key: string]: string | number
    domain?: string
    url: string
    orderNo?: number
    height: number
    width: number
    previewImage?: string
    pocType?: string
    urlType?: string
    directionType?: string
}

/** 섹션 별 이미지 구분 데이터 */
export interface ImageOfSectionTypeProp {
    formTitle?: Array<string> | string
    pocType?: Array<string>
    labelList?: RadioProps<string, string>[]
    hasAppImage?: boolean
    hasTvImage?: boolean
    imageKey?: keyof SectionImageProp
}

/** 이미지 렌더 타입 */
export interface ImageRenderTypeProp {
    renderElement?: JSX.Element | JSX.Element[]
    isMultiUpload?: boolean
}

export type SystemCodeItemProp = {
    imageType: CheckItemBySelectBox[]
    contentsType: RadioProps<string, string>[]
}

