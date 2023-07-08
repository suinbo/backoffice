import {  PAGINATION_FORMAT } from "@/utils/resources/constants"
import {
    ContentModalRequestProps,
    ContentsSettingItem,
    CurationDetailProp,
    CurationListProp,
    CurationRequestProp,
    CurationSectionData,
    DetailSelectBoxItem,
    ListSelectBoxItem,
    ModalSelectBoxItem,
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
    sectionYn: true, //섹션 설정
    contentImages: [], //콘텐츠 강조 이미지
    imageYn: true,
    images: [],
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

//에피소드 추가 모달
export const defaultEpisodeRequestData: ContentModalRequestProps = {
    pageNo: PAGINATION_FORMAT.DEFAULT_PAGE,
    pageSize: PAGINATION_FORMAT.DEFAULT_LIMIT,
    type: "",
    keywords: "",
    showYn: "",
    gradeCd: "",
}
