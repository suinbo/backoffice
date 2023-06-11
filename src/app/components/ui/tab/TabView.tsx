import React, { useMemo, useState } from "react"
import { TabViewProp, TabViewProps } from "@/components/ui/tabs/types"

const TabView = ({ activeView, tabViews }: TabViewProps) => {
    const [internalTabViews] = useState<Array<TabViewProp>>([...tabViews])

    const currentView = useMemo(() => {
        const foundView = internalTabViews.find(view => view.id == activeView)
        return foundView?.component ?? null
    }, [internalTabViews, activeView])

    return <div className="em-tab-view"> {currentView} </div>
}

export default TabView
