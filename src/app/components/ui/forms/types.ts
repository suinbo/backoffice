export type RendererType = {
    customLiRenderer?: (item: any) => JSX.Element
}

export type SelectBoxItem = {
    label?: string
    value: string
    data?: string
} & RendererType
