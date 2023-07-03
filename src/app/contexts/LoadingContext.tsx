import React, { createContext, useContext, useMemo, useState } from "react"
import Loading from "@/components/ui/progress"

interface LoadingContext {
    isLoading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const initState: LoadingContext = {
    isLoading: true,
    setLoading: () => ({}),
}

const LoadingContext = createContext<LoadingContext>({ ...initState })
LoadingContext.displayName = "LOADING_CONTEXT"

export const useLoading = () => useContext(LoadingContext)

export const LoadingProvider = React.memo(({ children }) => {
    const [isLoading, setLoading] = useState(true)

    const value = useMemo(() => ({ isLoading, setLoading }), [isLoading])

    return (
        <LoadingContext.Provider value={value}>
            {isLoading && (
                <div className="em-confirm show">
                    <Loading />
                </div>
            )}
            {children}
        </LoadingContext.Provider>
    )
})
