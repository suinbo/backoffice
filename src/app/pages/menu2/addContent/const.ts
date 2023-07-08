import {  PAGINATION_FORMAT } from "@/utils/resources/constants"
import {
    ContentModalRequestProps,
    ContentsSettingItem,
    SectionFormProp,
    CurationRequestProp,
    CurationSectionData,
    DetailSelectBoxItem,
    ListSelectBoxItem,
} from "./types"

//컨텐츠 타입코드 분류
export const VOD = "VOD",
    LIVE = "LIVE",
    UPLOAD = "UPLOAD",
    LINK = "LINK",
    HORIZONTAL = "HORIZONTAL",
    VERTICAL = "VERTICAL",
    //큐레이션 분류
    GENERAL = "GENERAL",
    CONTENT = "CONTENT",
    SPECIAL = "SPECIAL",
    USER = "USER",
    CATEGORY = "CATEGORY",
    //큐레이션 컨텐츠 조회 타입
    PROGRAM_MOVIE = "PROGRAM_MOVIE",
    EPISODE_ALL = "EPISODE_ALL",
    EPISODE_SINGLE = "EPISODE_SINGLE",
    CHANNEL = "CHANNEL",
    EPG = "EPG"

export const SECTION_DEFAULT_COUNT = 2
export const SPECIAL_MINIMUN_IMAGE = 2
export const CONTENT_MINIMUN_IMAGE = 5

export const defaultRequestData: CurationRequestProp = {
    page: PAGINATION_FORMAT.DEFAULT_PAGE,
    size: PAGINATION_FORMAT.DEFAULT_LIMIT,
    search: PAGINATION_FORMAT.DEFAULT_KEYWORD,
    type: "",
    codeId: "",
    curationClass: "",
    broadcastClass: "",
    pocs: [],
}

export const defaultSearchItem: ListSelectBoxItem = {
    search: [],
    broadcastClass: [],
    poc: [],
    curationClass: [],
}

export const defaultDetailItem: DetailSelectBoxItem = {
    contentsType: [],
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

export const defaultSectionData: CurationSectionData[] = [
    {
        sectionName: "", //섹션 명
        organizations: [], //컨텐츠 정보
    },
]

//에피소드 추가 모달
export const defaultEpisodeRequestData: ContentModalRequestProps = {
    pageNo: PAGINATION_FORMAT.DEFAULT_PAGE,
    pageSize: PAGINATION_FORMAT.DEFAULT_LIMIT,
    type: "",
    keywords: "",
    showYn: "",
    gradeCd: "",
}
