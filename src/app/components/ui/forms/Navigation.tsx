import React, { useCallback, useEffect, useState } from "react"
import { Link } from "react-scroll"

export interface NavItem {
    link: string
    title: string
}

interface NavigationType {
    item: Array<NavItem>
    refProps: { pageRef: React.MutableRefObject<HTMLDivElement> }
}

/**
 *  * Navigation Component
 *  * @param item component 정보 ({link: 연결대상 컴포넌트 ID 속성값, title: 탭 이름})
 *  * @param refProps useRef 정보 ({pageRef: Navigation 노출되는 페이지의 최상단 DIV ref})
 *  */
const Navigation = ({ item, refProps }: NavigationType) => {
    const NAVIGATOR_SPARE_PX = 10
    const [scrollBottom, setScrollBottom] = useState<boolean>(false)
    const [scrollTop, setScrollTop] = useState<boolean>(true)
    const [option, setOption] = useState<number>(0)

    const scrollEvent = useCallback(() => {
        const firstNaviActive = document.getElementById(item[0].link)?.offsetTop
        // 10 = 해상도 따라 계산식과 최하단 화면 좌표가 1~2px씩 차이나서 임의값 할당
        const scrolly = refProps.pageRef.current?.offsetHeight - window.innerHeight <= Math.ceil(window.scrollY) + NAVIGATOR_SPARE_PX
        scroll && !!refProps.pageRef.current?.offsetHeight && setScrollBottom(scrolly)
        // 네비게이션 첫번째 아이템에 스크롤이 focus가 되기 전에 active 효과를 주기위함
        setScrollTop(Math.ceil(window.scrollY) < firstNaviActive)
        setOption(window.scrollY)
    }, [])

    useEffect(() => {
        window.addEventListener("scroll", scrollEvent)

        // 탭 이동시 하이라이팅 초기화
        if (!option) {
            setScrollBottom(false)
            setScrollTop(true)
        }
        return () => {
            window.removeEventListener("scroll", scrollEvent)
        }
    }, [option])

    return (
        <div className="anchor-tab-box">
            <ul className="anchor-tab">
                {item.map(i => (
                    <Link
                        to={i.link}
                        spy={true}
                        key={`link-${i.link}`}
                        activeClass={!scrollBottom ? "active" : " "}
                        className={(scrollBottom && item.at(-1).link === i.link) || (scrollTop && item[0].link === i.link) ? "active" : ""}>
                        <li key={`navi-${i.link}`}>
                            <span>{i.title}</span>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    )
}

export default Navigation
