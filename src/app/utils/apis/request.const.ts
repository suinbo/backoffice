/** Backoffice Gateway URL */
export const API_REQUEST_URL = "http://localhost:3000" // http:// 미설정 시 CORS 에러 발생

export const X_AUTH_TOKEN = "x-auth-token"

/** REST API ENDPOINTS */
export const API = {
    LOGIN: "/api/post/login", // 로그인
    LOGOUT: "/api/v1/backoffice/auth/logout", // 로그아웃
    LOGIN_AUTH: "/api/v1/backoffice/auth", // 이메일 2차 인증 번호 발급
    LOGIN_EMAIL_CHECK: "/api/v1/backoffice/auth/check", // 발급받은 2차 인증 번호 체크
    TOP_MENUS: "/api/menus/top", // 상단메뉴 조회
    SIDE_MENUS: "/api/menus/side", // 네비메뉴 조회
    USER_HISTORY: "/api/users/infoHistory", // 로그인 기록 조회
    USER_INFO: "/admins/getAdmins",// 사용자 정보 조회
    TIMEZONE_LIST: "/api/timezones", // 타임존 목록 조회
    LANGUAGE_LIST: "/api/languages", // 사용 언어 조회
    USER_PASSWORD: "",
    FAQ_LIST: "/api/faqs/list", // FAQ 목록 조회

    OPCODE_LIST: "/api/opcodes", // 운영코드 조회
    SYSCODE_LIST: "/api/systemCodes", // 시스템코드 조회
}

/** HTTP METHODS */
export const HTTP_METHOD_GET = "get"
export const HTTP_METHOD_POST = "post"
export const HTTP_METHOD_PUT = "put"
export const HTTP_METHOD_DELETE = "delete"
