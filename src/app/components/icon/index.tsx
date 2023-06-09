import React, { lazy, Suspense } from "react"
import cx from "classnames"
import { NodeId } from "@/components/ui/tree/types"

const Gtranslate = lazy(() => import("@material-ui/icons/GTranslate"))
const PersonAdd = lazy(() => import("@material-ui/icons/PersonAdd"))
const Language = lazy(() => import("@material-ui/icons/Language"))
const Dashboard = lazy(() => import("@material-ui/icons/Dashboard"))
const Extension = lazy(() => import("@material-ui/icons/Extension"))
const SettingsApplications = lazy(() => import("@material-ui/icons/SettingsApplications"))
const LocalOffer = lazy(() => import("@material-ui/icons/LocalOffer"))
const ViewCarousel = lazy(() => import("@material-ui/icons/ViewCarousel"))
const LocalPlay = lazy(() => import("@material-ui/icons/LocalPlay"))
const LocalMovies = lazy(() => import("@material-ui/icons/LocalMovies"))
const AccountTree = lazy(() => import("@material-ui/icons/AccountTree"))
const Category = lazy(() => import("@material-ui/icons/Category"))
const TouchApp = lazy(() => import("@material-ui/icons/TouchApp"))
const SpeakerNotes = lazy(() => import("@material-ui/icons/SpeakerNotes"))
const MonetizationOn = lazy(() => import("@material-ui/icons/MonetizationOn"))
const CardGiftcard = lazy(() => import("@material-ui/icons/CardGiftcard"))
const Dvr = lazy(() => import("@material-ui/icons/Dvr"))
const DateRange = lazy(() => import("@material-ui/icons/DateRange"))
const Info = lazy(() => import("@material-ui/icons/Info"))
const Settings = lazy(() => import("@material-ui/icons/Settings"))
const Subscriptions = lazy(() => import("@material-ui/icons/Subscriptions"))
const VerticalSplit = lazy(() => import("@material-ui/icons/VerticalSplit"))
const HeadsetMic = lazy(() => import("@material-ui/icons/HeadsetMic"))
const Person = lazy(() => import("@material-ui/icons/Person"))
const Receipt = lazy(() => import("@material-ui/icons/Receipt"))
const Home = lazy(() => import("@material-ui/icons/Home"))
const ViewCompact = lazy(() => import("@material-ui/icons/ViewCompact"))
const SettingsOverscan = lazy(() => import("@material-ui/icons/SettingsOverscan"))
const AssignmentInd = lazy(() => import("@material-ui/icons/AssignmentInd"))
const Assignment = lazy(() => import("@material-ui/icons/Assignment"))
const Notifications = lazy(() => import("@material-ui/icons/Notifications"))
const ContactSupport = lazy(() => import("@material-ui/icons/ContactSupport"))
const Email = lazy(() => import("@material-ui/icons/Email"))
const EmailOutlined = lazy(() => import("@material-ui/icons/EmailOutlined"))
const Create = lazy(() => import("@material-ui/icons/Create"))
const BarChart = lazy(() => import("@material-ui/icons/BarChart"))
const Group = lazy(() => import("@material-ui/icons/Group"))
const ViewList = lazy(() => import("@material-ui/icons/ViewList"))

/** Common Icon Seletor */
const iconSelector = (id: NodeId, isActiveNode: boolean) => {
    const Icon = () => {
        switch (id) {
            case "M231Z157SAPVVOZD":
                return <Gtranslate className={cx("menu-icon gtranslate", { active: isActiveNode })} />
            case "M2827Z990TNMBOZ2":
                return <PersonAdd className={cx("menu-icon personAdd", { active: isActiveNode })} />
            case "M2825Z147GTWSYZ7":
                return <Dashboard className={cx("menu-icon dashboard", { active: isActiveNode })} />
            case "M2128Z507ROVXMZ0":
                return <Language className={cx("menu-icon language", { active: isActiveNode })} />
            case "M242Z121PWSGFZZS":
                return <Extension className={cx("menu-icon extension", { active: isActiveNode })} />
            case "M293Z785FXUOGFZ0":
                return <LocalOffer className={cx("menu-icon localOffer", { active: isActiveNode })} />
            case "M204Z133AOQRKSZB":
                return <ViewCarousel className={cx("menu-icon viewCarousel", { active: isActiveNode })} />
            case "M205Z028VINAULZS":
                return <LocalPlay className={cx("menu-icon localPlay", { active: isActiveNode })} />
            case "M226Z749EOZRFUZL":
                return <LocalMovies className={cx("menu-icon localMovies", { active: isActiveNode })} />
            case "M297Z706OXLSZWZ7":
                return <AccountTree className={cx("menu-icon accountTree", { active: isActiveNode })} />
            case "M258Z153MBVXFEZD":
                return <Category className={cx("menu-icon category", { active: isActiveNode })} />
            case "M289Z659GKLZWVZ1":
                return <TouchApp className={cx("menu-icon touchApp", { active: isActiveNode })} />
            case "M2410Z233BUPGUZ8":
                return <SpeakerNotes className={cx("menu-icon speakerNotes", { active: isActiveNode })} />
            case "M2537Z639ZHNNKZ7":
                return <MonetizationOn className={cx("menu-icon monetizationOn", { active: isActiveNode })} />
            case "M2611Z498ZCFFQZ3":
                return <MonetizationOn className={cx("menu-icon monetizationOn", { active: isActiveNode })} />
            case "M2312Z896YBLEUZ4":
                return <CardGiftcard className={cx("menu-icon cardGiftcard", { active: isActiveNode })} />
            case "M2042Z471BXVXZZT":
                return <CardGiftcard className={cx("menu-icon cardGiftcard", { active: isActiveNode })} />
            case "M2729Z676TENHMZN":
                return <Dvr className={cx("menu-icon dvr", { active: isActiveNode })} />
            case "M2030Z011PDWYAZK":
                return <DateRange className={cx("menu-icon dateRange", { active: isActiveNode })} />
            case "M2231Z929ZTWENZ8":
                return <Info className={cx("menu-icon info", { active: isActiveNode })} />
            case "M2332Z484VCFRDZZ":
                return <Settings className={cx("menu-icon settings", { active: isActiveNode })} />
            case "M2133Z294PHQQDZL":
                return <Subscriptions className={cx("menu-icon subscriptions", { active: isActiveNode })} />
            case "M2234Z847KWNRNZN":
                return <VerticalSplit className={cx("menu-icon verticalSplit", { active: isActiveNode })} />
            case "M2518Z113JXBNCZP":
                return <HeadsetMic className={cx("menu-icon headsetMic", { active: isActiveNode })} />
            case "M2036Z276MAISUZ8":
                return <Person className={cx("menu-icon person", { active: isActiveNode })} />
            case "M2035Z933VQCIOZ3":
                return <Receipt className={cx("menu-icon receipt", { active: isActiveNode })} />
            case "M2713Z971ZMASAZ7":
                return <Home className={cx("menu-icon home", { active: isActiveNode })} />
            case "M2114Z204UKUHCZO":
                return <ViewCompact className={cx("menu-icon viewCompact", { active: isActiveNode })} />
            case "M2415Z912VPXSSZ0":
                return <SettingsApplications className={cx("menu-icon SettingsApplications", { active: isActiveNode })} />
            case "M2316Z327UUURHZX":
                return <SettingsOverscan className={cx("menu-icon SettingsOverscan", { active: isActiveNode })} />
            case "M2617Z797WFGDAZ5":
                return <AssignmentInd className={cx("menu-icon AssignmentInd", { active: isActiveNode })} />
            case "M2519Z500UGJZUZ5":
                return <Assignment className={cx("menu-icon assignment", { active: isActiveNode })} />
            case "M2520Z066LOETNZ8":
                return <ContactSupport className={cx("menu-icon contactSupport", { active: isActiveNode })} />
            case "M2121Z480YGYVRZ9":
                return <Email className={cx("menu-icon email", { active: isActiveNode })} />
            case "M2322Z020ZWVEEZC":
                return <Notifications className={cx("menu-icon notifications", { active: isActiveNode })} />
            case "M2123Z005AOBSJZ0":
                return <EmailOutlined className={cx("menu-icon emailOutlined", { active: isActiveNode })} />
            case "M2024Z125OWXSWZ8":
                return <Create className={cx("menu-icon create", { active: isActiveNode })} />
            case "M2338Z526SXYLUZW":
                return <BarChart className={cx("menu-icon barChart", { active: isActiveNode })} />
            case "M2239Z163EVSPFZW":
                return <Group className={cx("menu-icon group", { active: isActiveNode })} />
            case "M2626Z719ZUUWOZ7":
                return <ViewList className={cx("menu-icon viewList", { active: isActiveNode })} />
            case "M2053Z997FAPPKZ0":
                return <Category className={cx("menu-icon category", { active: isActiveNode })} />
            case "M24146Z500MBHHZ0":
                return <SettingsApplications className={cx("menu-icon SettingsApplications", { active: isActiveNode })} />
            case "M23147Z299ZHIPZ1":
                return <ViewCarousel className={cx("menu-icon viewCarousel", { active: isActiveNode })} />
            case "M2921Z253YHKXLZ1":
                return <ViewCarousel className={cx("menu-icon viewCarousel", { active: isActiveNode })} />
            default:
                return <ViewCompact className={cx("menu-icon viewCompact", { active: isActiveNode })} />
        }
    }

    return (
        <Suspense fallback={null}>
            <Icon />
        </Suspense>
    )
}

export default iconSelector
