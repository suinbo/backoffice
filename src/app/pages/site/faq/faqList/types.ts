import { RadioProps } from "@/components/ui/forms/Radio"
import {
    POCCodeName,
    TableList,
    RequestPage,
    POCListProp,
    TimeType,
    NUMBER_BLINDRADIO_KEY,
    NUMBER_BLIND_RADIO_VALUE,
} from "@/utils/apis/request.types"

export type RadioLabelProp = RadioProps<NUMBER_BLINDRADIO_KEY, NUMBER_BLIND_RADIO_VALUE> & { styleType?: string }
export type RadioGroupProp = { [key: string]: RadioLabelProp }

export interface FAQList {
    no: string
    noId: string
    categoryCd: string
    categoryNm: string
    title: string
    updateId: string
    updateDt: string | number
    viewYn: string
    viewDt: string | number
    isAll: boolean
    pocList: POCCodeName[]
}

export type FAQListTypes = TableList<FAQList[]>

export type FAQRequesDataProp = {
    [key: string]: string | number | Array<string>
    categoryCd: Array<string>
    pocCd: Array<string>
    viewYn: string
    start?: number
    end?: number
    order: string
    orderType: string
} & RequestPage

export type FAQDetailProp = {
    title: string
    categoryCd: string
    viewDt?: number
    viewYn: boolean
    realtimeYn?: boolean
    readCnt?: number
    pocList: Array<POCListProp>
    content: string
}

export interface FAQPageProp {
    setRequestData: React.Dispatch<React.SetStateAction<FAQRequesDataProp>>
    requestData: FAQRequesDataProp
}

export type InitialState = {
    defaultDateTime: TimeType
    blindDateTime: TimeType
    checkedBlindDate: Array<string>
}
