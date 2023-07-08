import { FlagYN, RequestPage, TableList } from "@/utils/apis/request.types"
import { SelectBoxItem } from "@/components/ui/forms/types"
import { RadioProps } from "@/components/ui/forms/Radio"
import { RowItem } from "@/components/ui/table/tsTypes"

export type ModalSelectBoxItem = {
    pSearchType?: SelectBoxItem[]
    eSearchType?: SelectBoxItem[]
}

export type DetailSelectBoxItem = {
    contentsType?: RadioProps<string, string>[]
} & ModalSelectBoxItem

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

//섹션
export type CurationSectionData = {
    open?: boolean
    sectionOrder?: number
    sectionName?: string
    organizations?: Array<ContentsProp>
}

/** 콘텐츠 조회 타입 별 컴포넌트 데이터 */
export interface CurationSectionFormItem {
    formItem: RowItem[]
    modal?: RowItem[]
    selectboxItem?: ModalSelectBoxItem
}

export interface CurationModalSearchRequest<POCCD = string> extends RequestPage {
    class: string
    type: string
    pocCd: POCCD
    sType: string
    viewYn: FlagYN | "" //노출여부
}

/** 모달 */
export type EpisodeAddModalProps = {
    onClose: () => void
    item: Array<string>
    setItem: (value: Array<ContentsProp>) => void
    isRadio?: boolean
    customItems?: {
        columns?: RowItem[]
        selectBoxItems?: SelectBoxItem[] //검색조건 셀렉박스
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

export type ContentsListProp = TableList<Array<ContentsProp>>
export type ContentsProp = {
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