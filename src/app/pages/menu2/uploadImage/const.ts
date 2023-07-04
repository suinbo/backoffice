import { SectionImageProp, SystemCodeItemProp } from "./types";

//컨텐츠 타입코드 분류
export const VOD = "VOD",
    LIVE = "LIVE",
    UPLOAD = "UPLOAD",
    LINK = "LINK",
    HORIZONTAL = "HORIZONTAL",
    VERTICAL = "VERTICAL"

export const CONTENT_IMAGE_TYPE = "singleType"

export const ASC = "ASC",
    DESC = "DESC",
    ARRAY = "ARRAY"

export const SPECIAL_MINIMUN_IMAGE = 2

export const defaultDetailData: SectionImageProp = {
    imageType: [], 
    contentsType: "content1", 
    section1Images: [],
    section2Images: [],
    section3Images: [], 
    imageYn: true,
    
}

export const defaultSystemCodeData: SystemCodeItemProp = {
    contentsType: [], 
    imageType: [],
}
