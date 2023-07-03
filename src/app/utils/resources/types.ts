/**
 * TYPES OF LOGIN STATUS
 */
export type LoginStatusValue = "E1" | "E2" | "E3" | "E4"

export type RowItem = {
    [key: string]: string
}

export type NodeProp = object & { [key: string]: any }
export type NodeItems = Array<NodeProp>

export type SectionPanel = {
    id: string
    uxId: string
    menuNm?: string
    url?: string
    adminId?: string
    isTab?: boolean
    type?: string
    update?: boolean
    viewYn?: boolean
}

/** TYPES OF TABLE  */
export enum TableTheme {
    lined = "lined",
    boxed = "boxed",
}

export interface PaginationProps {
    offset: number
    limit: number
    total: number
    size?: number
    onChange?: (page: number) => void
}

/** TYPES OF UPLOAD FILE */
export type UploadFileProps = {
    id?: string
    name?: string
    fileList: File[]
}

export type UploadImageProps = {
    src: string
    no: number
    imgPath: string
    file: File
    width?: number
    height?: number
}

export type imageRequestProp = {
    file: File
    prefix?: string
    type?: string[]
    hasSize?: boolean
}

export type imageFileProp = {
    src: string
    imgPath: string
    width?: number
    height?: number
    no?: string | number
    file?: File
}
