export enum DividerIcon {
    format = "format",
    info = "info",
    search = "search",
    group = "group",
    image = "image",
    settings = "settings",
    history = "history",
    assignment = "assignment",
}

export type DividerHeaderProp = {
    title: string
    icon: DividerIcon
    refreshEvent?: () => void
    isFetching?: boolean
}

export const DividerPosition = {
    horizon: "horizon",
    vertical: "vertical",
} as const

export type WrapperProp = {
    pageTitle?: string
    position?: (typeof DividerPosition)[keyof typeof DividerPosition]
    isFold?: boolean
}
