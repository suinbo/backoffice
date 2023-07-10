import { TableList } from "@/utils/apis/request.types"
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
    sectionYn: boolean 
    sections?: Array<SectionDataProp>
}

export type SectionDataProp = {
    open?: boolean
    sectionOrder?: number
    sectionName?: string
    organizations?: Array<ContentsProp>
}

export type ContentsSettingItem = {
    [key: string]: {
        desc: string
        button: string
    }
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
    [key: string]: number | string | boolean
    orderNo?: number
    noId?: number
    pgCd?: string
    pgNm?: string
    epiCd?: string
    epiNm?: string
    serviceCnt?: number
    gradeNm?: string
    nation?: string
    viewYn?: number
    bandYn?: boolean
}