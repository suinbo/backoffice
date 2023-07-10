import { RowItem } from "./types"

export default {
    COOKIE_DOMAIN: location.hostname.replace("www.", ""),
}

export const HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    UNAUTHORIZED: 401,
}

/** 메뉴 URL */
export const MENUS = {
    HOME: "/",
    SIGNIN: "/signin",
    MYPAGE: "/mypage",
    FAQ: "/menu1/1/1",
    FAQ_DETAIL: "/menu1/1/1/detail",
    FAQ_MANAGEMENT: "/menu1/1/2",
    TREE: "/menu1/2",
    UPLOAD_IMAGE: "/menu2/1/1",
    ADD_CONTENT: "/menu2/1/2",
}

export const CUSTOM_MENUS = {
    HOME: {
        id: "MT000000",
        uxId: "CM0000",
    },
    MYPAGE: {
        id: "MT000001",
        uxId: "CM0001",
    },
}

export const UX_CODES: RowItem = {
    SPLASH: CUSTOM_MENUS.HOME.uxId,
    MYPAGE: CUSTOM_MENUS.MYPAGE.uxId,
}

export const UX_MAPPER = {
    [UX_CODES.MYPAGE]: MENUS.MYPAGE,
}

/** 화면 코드 */
export const VIEW_CODES: RowItem = {
    FAQ: "ST00110",
    POC: "poc",
    MENU1: "MENU100",
    MENU2: "MENU200"
}

export const MESSAGE_TYPE = {
    TAB: "tab",
}

export const ASC = "asc",
    DESC = "desc"

/** 로그인 상태 */
export const LOGIN_STATUS = {
    // 중복로그인
    MULTIPLE_LOGIN: "E1",
    // 임시비밀번호 발급
    TEMPORARY_PW: "E2",
    // 비밀번호 만료
    EXPIRED_PW: "E3",
    // 이메일인증
    AUTH_EMAIL: "E4",
}

/** 로그인 응답코드 */
export const RESPONSE_CODE = {
    SUCCESS: "0000", // 정상 코드
    AUTH_NUMBER_EXPIRED: "1028", // 2차 인증 시 인증 번호가 만료됐을 경우
    AUTH_NUMBER_NOT_MATCH: "1029", // 2차 인증 시 인증 번호가 일치하지 않은 경우
    AUTH_NUMBER_FAIL: "1030", // 2차 인증 시 3회 이상 인증 실패했을 경우
    AUTH_NUMBER_NOT_FOUND: "1031", // 2차 인증 시 인증 번호 발급이 되지 않은 경우
}

/** 다국어 키 */
export const T_NAMESPACE = {
    GLOBAL: "global",
    VALIDATE: "validate",
    INTRO: "intro",
    MENU1: "menu1",
    MENU2: "menu2"
}

export const T_PREFIX: RowItem = {
    MYPAGE: "myPage",
    TABLE: "table",
    TREE: "tree"
}

/** 메뉴관리 list key */
export const MENU_LIST = {
    UX_LIST: "uxList",
    LANG_LIST: "langList",
}

export const NUMBER = {
    MILLISECOND: 1000,
    MAXIMUM_TAB_SIZE: 10,
    MAX_PHONE_LENGTH: 13,
    PHONE_LENGTH: 11,
}

export const DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss"
export const DATE_FORMAT_LINE = "YYYY-MM-DD"
export const TIME_HMS_FORMAT = "HH:mm:ss"
export const DATE_PICKER_FORMAT = "yyyy-MM-dd"
export const TIME_HMS_START = "00:00:00"
export const TIME_HMS_END = "23:59:59"

export const PAGINATION_FORMAT = {
    DEFAULT_LIMIT: 10,
    DEFAULT_LIMIT_TWO: 20,
    DEFAULT_LIMIT_THREE: 30,
    DEFAULT_LIMIT_TEN: 100,
    DEFAULT_KEYWORD: "",
    DEFAULT_PAGE: 1,
}

export const FLAG = {
    ALL: "",
    Y: "Y",
    N: "N",
} as const

export const S3_SERVICE_PREFIX = {
    curation: "ntgs/menu2/navigator",
}

export const DATE_FILE_FORMAT = "YYYY/MM/DD"