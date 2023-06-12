import React, { useState } from "react"
import Container from "@/components/containers"
import { SMenuStateProvider } from "@/contexts/MenuContext"
import { NodeProp } from "@/utils/resources/types"
import GlobalComponent from "@/components/GlobalComponent"

const Home = () => {
    const [activeMenu, setActiveMenu] = useState<NodeProp | null>(null)

    return (
        <GlobalComponent>
            <SMenuStateProvider tMenu={activeMenu}>
                <Container.top activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
                <main className="main">
                    <Container.aside />
                    <Container.body />
                </main>
            </SMenuStateProvider>
        </GlobalComponent>
    )
}

export default React.memo(Home)
