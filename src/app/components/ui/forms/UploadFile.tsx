import { useConfirm } from "@/contexts/ConfirmContext"
import { T_NAMESPACE } from "@/utils/resources/constants"
import { IMAGETYPE } from "@/utils/resources/mimeTypes"
import { UploadFileProps } from "@/utils/resources/types"
import React from "react"
import { useTranslation } from "react-i18next"
import { ButtonStyleType } from "../buttons/types"
import { ConfirmType } from "../confirm/types"
import Input from "./Input"

type UploadFilesProps = {
    id: string
    name?: string
    multiUpload?: boolean
    onChange: ({ id, name, fileList }: UploadFileProps) => void
    refProps?: { inputRef: React.MutableRefObject<HTMLInputElement | null> }
    disabled?: boolean
}

const UploadFiles = ({ id, name, multiUpload = false, onChange, refProps, disabled = false }: UploadFilesProps) => {
    const { setVisible, setOptions } = useConfirm()
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)

    const checkImageFormat = (file: File) => {
        const fileType = file.type.split("/")[0]
        const isImageFormat = fileType === IMAGETYPE
        if (!isImageFormat) {
            setOptions({
                type: ConfirmType.alert,
                message: g("alert.imageCheck"),
                buttonStyle: ButtonStyleType.default,
                applyButtonMessage: g("button.ok"),
            })
            setVisible(true)
        }
        return isImageFormat
    }

    const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files, name, id } = e.target
        const fileList = Array.from(files)
        const typeCheck = fileList.map(item => checkImageFormat(item))
        if (files && files.length > 0 && !typeCheck.includes(false)) {
            onChange({ id, name, fileList })
        }
        e.target.value = null
    }

    return (
        <>
            <Input disabled={disabled} type="file" id={id} name={name} onChange={uploadFile} multiple={multiUpload} refProps={refProps} />
        </>
    )
}

export default React.memo(UploadFiles)
