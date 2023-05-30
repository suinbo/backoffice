import React from "react"
import Routes from "./route"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "./contexts/SessionContext"
import GlobalComponent from "./components/GlobalComponent"
import AxiosInterceptor from "./pages/home/axios"
import { SendAPIProvider } from "./contexts/SendApiContext"
import "@assets/styles/common.scss"

const App = () => {
    const queryClent = new QueryClient()
    return (
        <SessionProvider>
            {/*  401응답에 대한 알럿을 노출하기 위해 interceptor 상단에 배치 */}
            <GlobalComponent>
                <AxiosInterceptor>
                    {/* response로 오는 서버 error message를 출력하기 위해 route 외부로 배치 */}
                    {/* body에서 useAliveController.clear() 사용시 메모리 누수 방지 AliveScope 최상위 배치 */}
                    {/* <AliveScope> */}
                    <QueryClientProvider client={queryClent}>
                        <SendAPIProvider>
                                <Routes />
                        </SendAPIProvider>
                    </QueryClientProvider>
                    {/* </AliveScope> */}
                </AxiosInterceptor>
            </GlobalComponent>
        </SessionProvider>
    )
}

export default App
