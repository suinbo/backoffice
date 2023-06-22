import { lazy } from "react"
import Intro from "./default/intro"
import Home from "./home"

export default {
    Intro,
    Home,
    MyPage: lazy(() => import("./mypage")),
    Faq: lazy(() => import("./site/faq/faqList")),
    FaqDetail: lazy(() => import("./site/faq/faqList/FAQDetail")),
    FaqManagement: lazy(() => import("./site/faq/faqTypeList")),
    GroupManagement: lazy(() => import("./operation/menu")),
}
