import { RadioProps } from "@/components/ui/forms/Radio"
import { SelectBoxItem } from "@/components/ui/forms/types"
import { NUMBER_BLINDRADIO_KEY, NUMBER_BLIND_RADIO_VALUE, POCCodeName, RequestPage, TableList } from "@/utils/apis/request.types"

export type RadioLabelProp = RadioProps<NUMBER_BLINDRADIO_KEY, NUMBER_BLIND_RADIO_VALUE> & { styleType?: string }
export type RadioGroupProp = { [key: string]: RadioLabelProp }

export type FAQRequesDataProp = {
    [key: string]: string | number | Array<string>
    categoryCd: Array<string>
    pocCd: Array<string>
    viewYn: string
} & RequestPage

export type FAQProp = {
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

export type FAQListProp = TableList<FAQProp[]>

export type FAQTopProp = {
    no: string
    orderNo: number
    noId: string
    categoryCd: string
    categoryNm: string
    title: string
    updateId: string
    updateDt: number
    viewYn: string
    readCnt: number
}
export type FAQTopProps = TableList<FAQTopProp[]>

export type FAQTopModalProp = {
    categoryList: SelectBoxItem[]
    selectedPoc: SelectBoxItem
    selectedFaqs: string[]
}
