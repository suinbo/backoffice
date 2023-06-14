import { LabelStyleType } from "@/components/ui/labels/type"
import { PAGINATION_FORMAT, VIEW_CODES, DESC } from "@/utils/resources/constants"
import { FAQRequesDataProp, RadioGroupProp, RadioLabelProp } from "./types"

export const NUMBER_BLIND = {
    all: "",
    enabled: 1,
    disabled: 0,
    reserved: 2,
} as const

export const defaultRequestData: FAQRequesDataProp = {
    page: PAGINATION_FORMAT.DEFAULT_PAGE,
    size: PAGINATION_FORMAT.DEFAULT_LIMIT,
    search: PAGINATION_FORMAT.DEFAULT_KEYWORD,
    codeId: VIEW_CODES.FAQ,
    sType: "",
    categoryCd: [],
    pocCd: [],
    viewYn: "",
    order: DESC,
    orderType: "no",
}

/** 라디오 아이템 */
const ALL_RADIO: RadioLabelProp = {
    id: "all",
    title: "label.all",
    value: NUMBER_BLIND.all,
}

const ENABLED_RADIO: RadioLabelProp = {
    id: "enabled",
    title: "label.viewY",
    value: NUMBER_BLIND.enabled,
    styleType: LabelStyleType.success,
}

const DISABLED_RADIO: RadioLabelProp = {
    id: "disabled",
    title: "label.viewN",
    value: NUMBER_BLIND.disabled,
    styleType: LabelStyleType.danger,
}

const RESERVED_RADIO: RadioLabelProp = {
    id: "reserved",
    title: "label.viewReserve",
    value: NUMBER_BLIND.reserved,
    styleType: LabelStyleType.reservation,
}

export const RADIO_LABEL: RadioGroupProp = {
    [NUMBER_BLIND.disabled]: DISABLED_RADIO,
    [NUMBER_BLIND.enabled]: ENABLED_RADIO,
    [NUMBER_BLIND.reserved]: RESERVED_RADIO,
}

export const RADIO_LIST: RadioLabelProp[] = [ALL_RADIO, RESERVED_RADIO, ENABLED_RADIO, DISABLED_RADIO]

export const getLabel = (type: keyof RadioGroupProp) => RADIO_LABEL[type]
