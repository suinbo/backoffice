// IMG types
declare module "*.jpg"
declare module "*.png"
declare module "*.jpeg"
declare module "*.gif"
declare module "*.svg"
declare module "*.json"

declare module "@ckeditor/ckeditor5-react"
declare module "@ckeditor/ckeditor5-build-classic"
declare module "ckeditor5-custom-build/build/ckeditor"
declare module "ckeditor5-custom-build/build/translations/en"
declare module "react-scroll"

declare module "@lib/editor/ckeditor" {
    export default customEditor
}
declare module "@lib/editor/translations/en" {
    const eng: string
    export default eng
}

declare const __VERSION__: string
