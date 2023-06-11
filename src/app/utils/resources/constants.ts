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
    AUTH_PASSWORD: "/auth/password",
    AUTH_EMAIL: "/auth/email",
    MYPAGE: "",
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
}

export const NUMBER = {
    MILLISECOND: 1000,
    MAXIMUM_TAB_SIZE: 10,
}
