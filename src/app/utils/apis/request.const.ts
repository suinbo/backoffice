/** Backoffice Gateway URL */
export const API_BOGW_REQUEST_URL = process.env.GW_URL ?? ""

export const X_AUTH_TOKEN = "x-auth-token"

/** REST API ENDPOINTS */
export const API = {
    LOGIN: "/api/login", // 로그인
    LOGOUT: "/api/v1/backoffice/auth/logout", // 로그아웃
    LOGIN_AUTH: "/api/v1/backoffice/auth", // 이메일 2차 인증 번호 발급
    LOGIN_EMAIL_CHECK: "/api/v1/backoffice/auth/check", // 발급받은 2차 인증 번호 체크
}

/** HTTP METHODS */
export const HTTP_METHOD_GET = "get"
export const HTTP_METHOD_POST = "post"
export const HTTP_METHOD_PUT = "put"
export const HTTP_METHOD_DELETE = "delete"