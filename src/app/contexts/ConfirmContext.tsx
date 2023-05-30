import { Confirm } from "@/components/ui/confirm"
import { ConfirmType } from "@/components/ui/confirm/types"
import React, { createContext, useContext, useMemo, useState } from "react"

interface ConfirmState {
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    setOptions: React.Dispatch<React.SetStateAction<Options>>
}

type confirmOption = {
    type: (typeof ConfirmType)[keyof typeof ConfirmType]
    onApply?: () => void
    onClose?: () => void
    title: string
    message: string
    buttonStyle: string
    applyButtonMessage: string
}
type Options = Partial<confirmOption>

/** Top Menu Context */
const ConfirmContext = createContext<ConfirmState>(null)
ConfirmContext.displayName = "GLOBAL_CONFIRM_CONTEXT"

export const useConfirm = () => useContext(ConfirmContext)

const defaultOptions: Options = {
    type: ConfirmType.info,
    title: "",
    message: "",
    buttonStyle: "",
    applyButtonMessage: "",
}

/** Top menu State Provider */
export const ConfirmStateProvider = ({ children }: { children: React.ReactNode }) => {
    const [visible, setVisible] = useState<boolean>(false)
    const [options, setOptions] = useState<Options>({ ...defaultOptions })

    const value = useMemo(() => ({ visible, setVisible, setOptions }), [visible, options])

    return (
        <ConfirmContext.Provider value={value}>
            {children}
            <Confirm
                visible={visible}
                setVisible={setVisible}
                type={options.type}
                message={options.message.replace(/\\n/g, "\n")}
                title={options.title}
                buttonStyle={options.buttonStyle}
                applyButtonMessage={options.applyButtonMessage}
                onApply={options?.onApply}
                onClose={options?.onClose}
            />
        </ConfirmContext.Provider>
    )
}
