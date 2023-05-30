import React from "react"

//버튼 스타일 속성 상수
export const ButtonStyleType = {
    primary: "primary", // background blue
    secondary: "secondary", // background darkgray
    default: "default", // background gray
    danger: "danger", // background red
    confirm: "confirm", // background #9000ff 임시 비밀번호 발급 참조
    calendar: "calendar", // 기존 calendar
} as const

//버튼 기능속성 상수
export const ButtonOptionType = {
    default: "default", // 기본
    edit: "edit", //수정버튼 모드 (읽기,수정,삭제)
} as const

export interface ButtonProp {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
    children?: any
    styleType: string
    disabled?: boolean
    border?: boolean
    classList?: Array<string>
    type?: "button" | "submit" | "reset"
    // hasEditAuth?: boolean // 쓰기속성 여부
}

/**
 * TYPES OF DELTEBUTTON
 **/

export type DeleteEvent = React.MouseEvent<HTMLButtonElement> | React.MouseEvent<SVGSVGElement, MouseEvent>

export enum DeleteButtonType {
    Button = "Button",
    DeleteRounded = "DeleteRounded",
    Reject = "Reject",
}

export interface DeleteButtonProp {
    type?: DeleteButtonType
    alertMsg?: string
    onClick?: () => void
    buttonProp?: Partial<ButtonProp> | null
    hasAuthority?: boolean
}

export interface LinkButtonProps {
    linkUrl: string
}
