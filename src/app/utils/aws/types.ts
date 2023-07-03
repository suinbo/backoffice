export type S3UploadFile = {
    key: string
    file: File
    option?: string
}

export type S3UploadFiles = {
    bucket: string
    prefix?: string
    files: S3UploadFile[]
}

export type S3UploadResponse = {
    key: string
    code: boolean
}
