import { FlagYN, RequestPage, TableList } from "@/utils/apis/request.types"
import { CheckItemBySelectBox, SelectBoxItem } from "@/components/ui/forms/types"
import { RadioProps } from "@/components/ui/forms/Radio"
import { FLAG } from "@/utils/resources/constants"
import { RowItem } from "@/components/ui/table/tsTypes"

import { RadioProps } from "@/components/ui/forms/Radio"
import { CheckItemBySelectBox } from "@/components/ui/forms/types"

export const NUMBER_BLIND = {
    enabled: FLAG.Y,
    disabled: FLAG.N,
} as const

export type NUMBER_BLINDRADIO_KEY = keyof typeof NUMBER_BLIND
export type NUMBER_BLIND_RADIO_VALUE = typeof NUMBER_BLIND[keyof typeof NUMBER_BLIND]

export interface CurationRequestProp extends RequestPage {
    type: string
    curationClass: string
    broadcastClass: string
    pocs: Array<string>
    codeId: string
}

export interface CurationDefaultProp {
    requestData: CurationRequestProp
    setRequestData: React.Dispatch<React.SetStateAction<CurationRequestProp>>
}

export interface ListSelectBoxItem {
    search: SelectBoxItem[]
    broadcastClass: SelectBoxItem[]
    poc: SelectBoxItem[]
    curationClass: SelectBoxItem[]
}

export interface DetailSelectBoxItem {
    broadcastClass?: RadioProps<string, string>[]
    poc: CheckItemBySelectBox[]
    curationClass?: RadioProps<string, string>[]
    contentsType?: RadioProps<string, string>[]
    channelType?: RadioProps<string, string>[]
}

export interface ModalSelectBoxItem {
    search?: SelectBoxItem[]
    programMovieSearch?: SelectBoxItem[]
    allEpisodeSearch?: SelectBoxItem[]
    singleEpisodeSearch?: SelectBoxItem[]
    channelType?: SelectBoxItem[]
    contentType?: SelectBoxItem[]
    content?: SelectBoxItem[]
}

export interface CurationListProp {
    no: number
    code: string
    broadcastClass: string //편성 분류
    title: string
    poc: string
    curationType: string
    updateDt: number
    updateId: string
}

export type CurationTableList = TableList<Array<CurationListProp>>

export type CurationDetailProp = {
    //기본 정보
    code?: string
    title: string
    pocs: string[]
    contentsType: string
    //콘텐츠 편성
    broadcastClass: string //편성 분류
    curationType: string //큐레이션 분류
    sectionYn: boolean //섹션 설정
    contentImages?: Array<CurationImageInfo> //콘텐츠 강조 이미지
    specialCode?: string //스페셜관 코드
    specialName?: string //스페셜관 명
    specialType?: string //스페셜관 유형
    specialImages?: Array<CurationImageInfo> //스페셜관 이미지
    imageYn?: boolean //이미지 사용여부
    images?: Array<CurationImageInfo> //POC별 이미지
    marketingText1: string //마케팅 문구1
    marketingText2: string //마케팅 문구2
    viewAllUrl?: string //전체보기(더보기) URL
    sections?: Array<CurationSectionData>
}

export type ContentsSettingItem = {
    [key: string]: {
        desc: string
        button: string
    }
}

export interface RequestParams {
    [key: string]: any
}

//섹션 별 콘텐츠
export type ContentsProp = {
    [key: string]: string | number | boolean
    //프로그램,영화
    orderNo?: number
    contentType?: string
    contentCode?: string
    contentName?: string
    genre?: string
    //에피소드(전체)
    programCode?: string
    programName?: string
    episodeCode?: string
    episodeName?: string
    channelCode?: string
    channelName?: string
    servEpiCnt?: number
    epiCnt?: number
    bandYn?: boolean
    //큐레이션분류(카테고리형)
    apiCd?: string
    apiNm?: string
    categoryNm?: string
}

//섹션
export type CurationSectionData = {
    open?: boolean
    sectionOrder?: number
    sectionName?: string
    episodeOrder?: string
    organizations?: Array<ContentsProp>
}

export type CurationImageInfo = {
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

/** 콘텐츠 조회 타입 별 컴포넌트 데이터 */
export interface CurationSectionFormItem {
    formItem: RowItem[]
    modal?: RowItem[]
    selectboxItem?: ModalSelectBoxItem
    ctsTypeCd?: string[]
    labelList?: RadioProps<string, string>[]
}

/** 섹션 별 이미지 데이터 */
export interface CurationImageFormItem {
    formTitle?: Array<string> | string
    pocType?: Array<string>
    labelList?: RadioProps<string, string>[]
    hasAppImage?: boolean
    hasTvImage?: boolean
    imageKey?: keyof CurationDetailProp
}

/** 이미지 렌더 타입 */
export interface CurationIamgeRenderType {
    renderElement: JSX.Element | JSX.Element[]
    isMultiUpload: boolean
    description?: {
        [key: string]: string
    }
}

/** 큐레이션 모달 */
export interface CurationSearchRequest extends RequestPage {
    pocCd: string
    broadcastClass: string //편성분류
    curationClass: string
}

export interface CurationModalSearchRequest<POCCD = string> extends RequestPage {
    class: string
    type: string
    pocCd: POCCD
    sType: string
    viewYn: FlagYN | "" //노출여부
}

/** new */
export type SectionImagesProp = Array<SectionOfImageProp>
export type SectionOfImageProp = {
    poc?: Array<string>
    sectionOrder: number,
    imageType?: string
    pocType?: string
    contentsType?: string,
    images: Array<ImageProp>
}

export type ImageProp = {
    [key: string]: string | number
    domain?: string
    url: string
    orderNo?: number
    height: number
    width: number
    previewImage?: string
    urlType?: string
}

export type SystemCodeItemProp = {
    imageType: CheckItemBySelectBox[]
    contentsType: RadioProps<string, string>[]
}
