export type ValidProp = {
    isIDChecked: boolean
    existYn: boolean
    checkSecretPw: string
}

export type SignUpProp = {
    accessId: string
    secretPw: string
    name: string
    phone: string
    email: string
    department: string
}

export type TemporaryPasswordProp = {
    id: string
    name: string
    email: string
}
