import { ToolTip } from "@/components/ui/tooltip"
import React, { createContext, useCallback, useContext, useMemo, useState } from "react"

type ToolTipProp = {
    message: string
    pageX: number
    pageY: number
}
interface ToolTipState {
    onMouse: boolean
    setOnMouse: React.Dispatch<React.SetStateAction<boolean>>
    setOptions: React.Dispatch<React.SetStateAction<ToolTipProp>>
    tooltipHandler: (e: React.MouseEvent<HTMLElement, MouseEvent>, mouseEvent: boolean, message: string | React.ReactNode | JSX.Element) => void
}

const initState: ToolTipState = {
    onMouse: false,
    setOnMouse: () => ({}),
    setOptions: () => ({}),
    tooltipHandler: () => ({}),
}

const ToolTipContext = createContext<ToolTipState>({ ...initState })
ToolTipContext.displayName = "GLOBAL_TOOLTIP_CONTEXT"

export const useToolTip = () => useContext(ToolTipContext)

const defaultOptions = {
    message: "",
    pageX: 0,
    pageY: 0,
}

export const ToolTipStateProvider: React.FC = ({ children }) => {
    const [onMouse, setOnMouse] = useState<boolean>(false)
    const [options, setOptions] = useState<ToolTipProp>(defaultOptions)

    const tooltipHandler = useCallback(
        (e: React.MouseEvent<HTMLElement, MouseEvent>, mouseEvent: boolean, message: string) => {
            if ((e.target as HTMLElement).offsetWidth < (e.target as HTMLElement).scrollWidth) {
                if (mouseEvent) {
                    setOptions({
                        message: message,
                        pageX: e.pageX,
                        pageY: e.pageY,
                    })
                }
                setOnMouse(mouseEvent)
            }
        },
        [onMouse]
    )

    const value = useMemo(() => ({ tooltipHandler, onMouse, setOnMouse, setOptions }), [onMouse, options])
    return (
        <ToolTipContext.Provider value={value}>
            <ToolTip onMouse={onMouse} setOnMouse={setOnMouse} message={options.message} pageX={options.pageX} pageY={options.pageY} />
            {children}
        </ToolTipContext.Provider>
    )
}
