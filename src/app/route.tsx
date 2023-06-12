import Loading from "@/components/ui/progress"
import { BrowserHistory } from "history"
import React, { Suspense, useLayoutEffect, useState } from "react"
import { Route, Router, Routes } from "react-router-dom"
import { history } from "./history"
import Pages from "./pages"
import { MENUS } from "./utils/resources/constants"

interface CustomRouterProps {
    history: BrowserHistory
    children: React.ReactNode
}

const CustomRouter = ({ history, ...props }: CustomRouterProps) => {
    const [state, setState] = useState({
        action: history.action,
        location: history.location,
    })

    useLayoutEffect(() => history.listen(setState), [history])

    return <Router {...props} location={state.location} navigationType={state.action} navigator={history} />
}

const routes = () => {
    return (
        <Suspense fallback={<Loading />}>
            <CustomRouter history={history}>
                <Routes>
                    <Route path={MENUS.SIGNIN} element={<Pages.Intro />} />
                    <Route path={MENUS.HOME} element={<Pages.Home />} />
                    <Route path={MENUS.MYPAGE} element={<Pages.MyPage />} />
                </Routes>
            </CustomRouter>
        </Suspense>
    )
}

export default routes
