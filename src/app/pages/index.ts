import { lazy } from "react"
import Intro from "./default/intro"
import Home from "./home"

export default {
    Intro,
    Home,
    MyPage: lazy(() => import("./mypage")),
}
