import {  PAGINATION_FORMAT } from "@/utils/resources/constants"
import {
    ContentModalRequestProps,
    ContentsSettingItem,
    SectionFormProp,
    SectionDataProp,
    DetailSelectBoxItem,
} from "./types"

export const SECTION_DEFAULT_COUNT = 2

export const defaultDetailItem: DetailSelectBoxItem = {
    contentsType: [],
    pSearchType: [],
    eSearchType: []
}

export const defaultDetailData: SectionFormProp = {
    contentsType: "content1", 
    sectionYn: true, 
    sections: [],
}

/** 컨텐츠 조회 타입별 화면 문구 */
export const contentsSettingType: ContentsSettingItem = {
    content1: {
        desc: "settingDescription",
        button: "addContents",
    },
    content2: {
        desc: "settingDescription",
        button: "addContents",
    },
    content3: {
        desc: "settingDescription",
        button: "addContents",
    },
}

export const defaultSectionData: SectionDataProp[] = [
    {
        open: true,
        sectionName: "", 
        organizations: [], 
        sectionOrder: 1
    },
]

/** 컨텐츠 추가 모달 요청 파람 타입 */
export const defaultEpisodeRequestData: ContentModalRequestProps = {
    pageNo: PAGINATION_FORMAT.DEFAULT_PAGE,
    pageSize: PAGINATION_FORMAT.DEFAULT_LIMIT,
    type: "",
    keywords: "",
    showYn: "",
    gradeCd: "",
}
