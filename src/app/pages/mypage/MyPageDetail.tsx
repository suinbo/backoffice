import React, { useCallback, useMemo, useState } from "react"
import { Tabs } from "@/components/ui/tab"
import { T_NAMESPACE, T_PREFIX } from "@/utils/resources/constants"
import { useTranslation } from "react-i18next"
//import MyPagePassword from "./detail/PasswordDetail"
//import MyPageDetail from "./detail/MyInfoDetail"
import { NodeProp } from "@/components/ui/tree/types"
import { TabTheme } from "@/components/ui/tab/types"

const MyPageTabs = () => {
    const { t } = useTranslation(T_NAMESPACE.INTRO, { keyPrefix: T_PREFIX.MYPAGE })
    const tabListItems = useMemo(
        () => [
            { id: "detail", title: t("detailInfo") },
            { id: "password", title: t("password") },
        ],
        []
    )
    const [activeListTab, setActiveListTab] = useState<NodeProp>(tabListItems[0])

    const onSelectUserListTab = (tab: NodeProp) => {
        setActiveListTab(tab)
    }

    const tabView = useCallback(() => {
        //return activeListTab.id === tabListItems[0].id ? <MyPageDetail /> : <MyPagePassword />
    }, [activeListTab, tabListItems])

    return (
        <>
            <Tabs tabs={tabListItems} selectedTab={activeListTab?.id} hasCloseButton={false} onSelect={onSelectUserListTab} theme={TabTheme.lined} />
            {tabView()}
        </>
    )
}

export default React.memo(MyPageTabs)
