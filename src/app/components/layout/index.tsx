import { Assignment, FormatListBulleted, Group, HistoryOutlined, InfoOutlined, Refresh, Search, Settings, Wallpaper } from "@material-ui/icons"
import cx from "classnames"
import React from "react"
import "./styles.scss"
import { DividerHeaderProp, DividerIcon, WrapperProp } from "./types"

/** 컨텐츠 컨테이너 영역 */
const Wrapper: React.FC<WrapperProp> = React.memo(({ pageTitle, children, position, isFold }) => {
    return (
        <section className={cx("layer-wrapper", position)}>
            {!!pageTitle && (
                <div className="layer-header">
                    <h3> {pageTitle} </h3>
                </div>
            )}
            {!!children && <div className={cx("layer-body", { fold: isFold })}>{children}</div>}
        </section>
    )
})

/** 데이터 영역  */
const Divider: React.FC = React.memo(({ children }) => {
    return (
        <aside className={"layer-divider"}>
            <div className="divider-body">{children}</div>
        </aside>
    )
})

/** 레이어 헤더 영역 */
const DividerHeader: React.FC<DividerHeaderProp> = React.memo(({ title, icon, children, refreshEvent, isFetching }) => {
    return (
        <div className="divider-header">
            <p className="divider-header-category">
                {icon === DividerIcon.format && <FormatListBulleted className="format" />}
                {icon === DividerIcon.info && <InfoOutlined className="info" />}
                {icon === DividerIcon.search && <Search className="search divider-icon" />}
                {icon === DividerIcon.group && <Group className="group divider-icon" />}
                {icon === DividerIcon.image && <Wallpaper className="divider-icon" />}
                {icon === DividerIcon.settings && <Settings className="setting" />}
                {icon === DividerIcon.history && <HistoryOutlined className="history" />}
                {icon === DividerIcon.assignment && <Assignment className="assignment" />}
                <span> {title} </span>
                {refreshEvent && <Refresh className="refresh-icon" onClick={!isFetching ? refreshEvent : () => ({})} />}
            </p>
            {children}
        </div>
    )
})

export default {
    Wrapper: Wrapper,
    Divider: Divider,
    DividerHeader: DividerHeader,
}
