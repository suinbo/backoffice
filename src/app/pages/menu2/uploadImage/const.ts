import { PAGINATION_FORMAT } from "@/utils/resources/constants";
import { ContentsSettingItem, CurationDetailProp, CurationListProp, CurationRequestProp, CurationSectionData, DetailSelectBoxItem, ListSelectBoxItem, ModalSelectBoxItem, SectionImagesProp, SystemCodeItemProp } from "./types";

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

export const CONTENT_IMAGE_TYPE = "singleType"

export const ASC = "ASC",
    DESC = "DESC",
    ARRAY = "ARRAY"

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
    broadcastClass: [],
    poc: [],
    curationClass: [],
    contentsType: [],
    channelType: [],
}

export const defaultModalItem: ModalSelectBoxItem = {
    search: [],
    contentType: [],
    content: [],
}

export const defaultDetailData: CurationDetailProp = {
    code: "", //큐레이션 코드
    title: "", //큐레이션 명
    pocs: [], //설정 POC
    contentsType: "content1", //큐레이션 분류
    broadcastClass: "VOD", //편성 분류
    curationType: "PROGRAM_MOVIE", //콘텐츠 조회
    sectionYn: false, //섹션 설정
    contentImages: [], //콘텐츠 강조 이미지
    specialCode: "", //스페셜관 코드
    specialName: "", //스페셜관 명
    specialType: "", //스페셜관 유형
    specialImages: [],
    imageYn: true,
    images: [],
    marketingText1: "",
    marketingText2: "",
    viewAllUrl: "",
    sections: [],
}

/** 컨텐츠 조회 타입별 화면 문구 */
export const contentsSettingType: ContentsSettingItem = {
    PROGRAM_MOVIE: {
        desc: "descMultiScheduling",
        button: "addProgramMovie",
    },
    EPISODE_ALL: {
        desc: "descAutoScheduling",
        button: "addContents",
    },
    EPISODE_SINGLE: {
        desc: "descSingleScheduling",
        button: "addSingleEpisode",
    },
    CHANNEL: {
        desc: "descChannelScheduling",
        button: "addChannel",
    },
    EPG: {
        desc: "descEPGScheduling",
        button: "addEpg",
    },
}

export const defaultSectionData: CurationSectionData[] = [
    {
        sectionName: "", //섹션 명
        organizations: [], //컨텐츠 정보
        episodeOrder: ARRAY, //에피소드 정렬순서
    },
]

export const defaultList: Array<CurationListProp> = [
    {
        no: 0,
        code: "",
        broadcastClass: "",
        title: "",
        poc: "",
        curationType: "",
        updateDt: 0,
        updateId: "",
    },
]

/** new */
export const defaultFormData: SectionImagesProp = [
    { sectionOrder: 1, images: [] },
    { sectionOrder: 2, images: [] },
    { sectionOrder: 3, images: [] },
]

export const defaultSystemCodeData: SystemCodeItemProp = {
    contentsType: [], 
    imageType: [],
}
