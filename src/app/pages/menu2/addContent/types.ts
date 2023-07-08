import { FlagYN, RequestPage, TableList } from "@/utils/apis/request.types"
import { CheckItemBySelectBox, SelectBoxItem } from "@/components/ui/forms/types"
import { RadioProps } from "@/components/ui/forms/Radio"
import { FLAG } from "@/utils/resources/constants"
import { RowItem } from "@/components/ui/table/tsTypes"

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
    pSearchType?: SelectBoxItem[]
    eSearchType?: SelectBoxItem[]
    contentsType?: RadioProps<string, string>[]
}

export interface ModalSelectBoxItem {
    pSearchType?: SelectBoxItem[]
    eSearchType?: SelectBoxItem[]
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

export type SectionFormProp = {
    contentsType: string
    sectionYn: boolean //섹션 설정
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

export interface CurationModalSearchRequest<POCCD = string> extends RequestPage {
    class: string
    type: string
    pocCd: POCCD
    sType: string
    viewYn: FlagYN | "" //노출여부
}

/** 모달 */
export type ContentAddRequestProps = {
    pageNo: number
    pageSize: number
    ctsTypeCd?: string
    type: string
    keywords: string
    tvingCtsType?: string
    showYn: string
    ctsType?: string
    gradeCd?: string
}

export type EpisodeAddModalProps = {
    onClose: () => void
    item: Array<string>
    setItem: (value: Array<ContentsList>) => void
    isRadio?: boolean
    customItems?: {
        columns?: RowItem[]
        selectBoxItems?: SelectBoxItem[] //검색타입
    }
}

export type ContentModalRequestProps = {
    pageNo: number
    pageSize: number
    type: string
    keywords: string
    showYn: string
    gradeCd?: string
}

export type ContentsListProp = TableList<Array<ContentsList>>
export type ContentsList = {
    noId: number
    pgCd: string
    pgNm: string
    epiCd: string
    epiNm: string
    serviceCnt: number
    gradeNm: string
    nation: string
    viewYn: number
}