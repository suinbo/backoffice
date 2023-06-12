import React, { useCallback, useEffect, useState } from "react"
import cx from "classnames"
import { useTranslation } from "react-i18next"
import { API } from "@/utils/apis/request.const"
import { T_NAMESPACE } from "@/utils/resources/constants"
import { useSMenu } from "@/contexts/MenuContext"
import { useRequest } from "@/contexts/SendApiContext"
import { NodeProp } from "@/utils/resources/types"
import LoginInfo from "./LoginInfo"
import "./styles.scss"

/** GNB */
const Top = ({
    activeMenu,
    setActiveMenu,
}: {
    activeMenu: NodeProp | null
    setActiveMenu: React.Dispatch<React.SetStateAction<NodeProp | null>>
}) => {
    const { useFetch } = useRequest()
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
    //const { regionList, region, setActiveRegionCode, hideRegionSelect } = useRegion()
    //const [selectItem, setSelectItem] = useState<SelectBoxItem[]>([])
    //const { data: menus, error, refetch: mutate, isFetching: isValidating } = useFetch<NodeProp[]>(region ? { url: API.TOP_MENUS } : null)
    const { data: menus, error, refetch: mutate, isFetching: isValidating } = useFetch<NodeProp[]>({ url: API.TOP_MENUS })

    const { mutateMenus } = useSMenu()

    // useEffect(() => {
    //     if (regionList) {
    //         setSelectItem(
    //             regionList.map(region => ({
    //                 value: region.code,
    //                 label: `${region.code}(${g(`region.${region.code}`)})`,
    //             }))
    //         )
    //     }
    // }, [regionList, region])

    //탑 메뉴 리전 변경시만 첫번째 메뉴 셀렉트
    useEffect(() => {
        // menus 호출 완료되기 전 setState방지 && 메뉴관리 탑메뉴 순서 변경시 첫번째 메뉴 선택 방지
        if (!!menus && !isValidating && !activeMenu) {
            setActiveMenu(menus[0])
            mutateMenus()
        }
    }, [isValidating])

    const onClickMenu = (e: React.MouseEvent, menu: NodeProp) => {
        e.preventDefault()
        setActiveMenu(menu)
    }

    // const onChangeRegion = useCallback(
    //     (regionValue: SelectBoxItem) => {
    //         if (regionValue.value != region?.regionCode) {
    //             setActiveRegionCode(regionValue.value)
    //             setActiveMenu(null)
    //             mutate()
    //         }
    //     },
    //     [region]
    // )

    return (
        <header>
            <div className="logo-wrap">OFFICE</div>
            <div className="top">
                <nav>
                    {!error &&
                        menus?.map((menu: NodeProp) => (
                            <div
                                className={cx("menu-item", {
                                    active: activeMenu?.id == menu.id,
                                })}
                                key={menu.id as string}
                                onClick={e => onClickMenu(e, menu)}>
                                <span> {menu.menuNm} </span>
                            </div>
                        ))}
                </nav>

                <div className="setting">
                    {/** TEST Locale selector */}
                    {/*<SelectBox*/}
                    {/*    items={[{ value: 'KR' }, { value: 'EN' }]}*/}
                    {/*    onChange={onChangeLocale}*/}
                    {/*    classList="nav-selector"*/}
                    {/*/>*/}
                    {/* {hideRegionSelect && (
                        <SelectBox
                            items={[{ value: "global" }]}
                            defaultItem={{
                                value: "global",
                            }}
                            classList="nav-selector"
                            isTop={true}
                        />
                    )}

                    {!hideRegionSelect && (
                        <SelectBox
                            defaultLabel={`${region?.regionCode}(${g(`region.${region?.regionCode}`)})`}
                            items={selectItem}
                            defaultItem={{
                                label: `${region?.regionCode}(${g(`region.${region?.regionCode}`)})`,
                                value: region.regionCode,
                            }}
                            onChange={onChangeRegion}
                            classList="nav-selector"
                            isTop={true}
                        />
                    )} */}

                    {/* Login 정보 레이아웃 */}
                    <LoginInfo />
                </div>
            </div>
        </header>
    )
}

export default React.memo(Top)
