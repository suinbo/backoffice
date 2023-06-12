import React, { forwardRef, MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { OptionStyleProp, SelectBoxItem, SelectboxProp, sizeCheckProp } from "./types"
import cx from "classnames"
import { useTranslation } from "react-i18next"
import { T_NAMESPACE } from "@/utils/resources/constants"
import { useToolTip } from "@/contexts/ToolTipContext"
import { getTimeDigits } from "@/utils/common"
import { isValidTimeFormat } from "@/utils/resources/validators"

const defaultOptionValue: OptionStyleProp = {
    top: "0px",
}

const defaultSizeValue: sizeCheckProp = {
    width: innerWidth,
    height: innerHeight,
    scrollX: scrollX,
    scrollY: scrollY,
}

/** Common Select Box */
const SelectBox = forwardRef<HTMLDivElement, SelectboxProp>((props, ref: MutableRefObject<HTMLDivElement>) => {
    const {
        defaultLabel,
        defaultItem,
        items,
        onChange,
        classList,
        isBoxIn,
        isTableIn,
        isTop, // 전체 체크박스 사용여부
        hasAll = false,
        isEdit = false,
        disabled = false,
        children,
        customLiRenderer, // 커스텀 리스트 아이템
    } = props
    const [visible, setVisible] = useState<boolean>(false)
    const [currentItem, setCurrentItem] = useState<SelectBoxItem | undefined>()
    const [optionStyle, setOptionStyle] = useState<OptionStyleProp>(defaultOptionValue)
    const [sizeData, setSizeData] = useState<sizeCheckProp>(defaultSizeValue)
    const selectBoxRef = useRef<HTMLDivElement>(null)
    const selectBoxOptionRef = useRef<HTMLDivElement>(null)
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)

    const { tooltipHandler, setOnMouse } = useToolTip()

    // 전체 항목
    const selectItems = useMemo(() => (hasAll ? [{ label: g("label.all"), value: "" }, ...items] : items), [items])

    useEffect(() => setCurrentItem(defaultItem), [defaultItem])

    useEffect(() => {
        // 초기 화면 접근시 검색 조건 Type을 설정하기 위해 onChange 이벤트 발생
        if (!defaultItem && !defaultLabel && !!items[0]) {
            setCurrentItem(items[0])
            onChange(items[0])
        }
    }, [items])

    /** SelectBox Change Event */
    const handleChange = (e: React.MouseEvent<HTMLElement>, item: SelectBoxItem) => {
        e.stopPropagation()
        setCurrentItem(item)
        onChange(item)
        setVisible(false)
        setOnMouse(false)
    }

    // 브라우저 화면 크기 변경될 경우 SelectBox Option 위치 변경
    const isResize = useCallback(() => {
        selectBoxRef.current && setSizeData(prev => ({ ...prev, width: window.innerWidth, height: window.innerHeight }))
    }, [selectBoxRef])

    // 브라우저 스크롤 이벤트 발생할 경우 SelectBox Option 위치 변경
    const isScroll = useCallback(() => {
        if (visible && selectBoxRef.current) {
            const scrollX = isTop ? document.getElementById("root").scrollLeft : window.scrollX
            setSizeData(prev => ({ ...prev, scrollX, scrollY: window.scrollY }))
        }
    }, [selectBoxRef, visible, isTop])

    useEffect(() => {
        const isVisible = () => selectBoxRef.current && setVisible(false)

        !!window && window.addEventListener("resize", isResize)
        !!window && window.addEventListener("scroll", isScroll)

        /** 상단 셀렉트박스일 경우 scroll 감지 */
        const elRoot = document.getElementById("root")
        isTop && elRoot.addEventListener("scroll", isScroll)

        if (ref) ref.current.addEventListener("scroll", isVisible)

        optionSetPosition()

        return () => {
            !!window && window.removeEventListener("resize", isResize)
            !!window && window.removeEventListener("scroll", isScroll)
            isTop && elRoot.removeEventListener("scroll", isScroll)
        }
    }, [sizeData, visible, ref])

    // SelectBox 외부 영역 클릭 시 숨김 처리
    useEffect(() => {
        const isOutsideClick = (e: MouseEvent) => {
            if (!selectBoxRef.current?.contains(e.target as Node)) setVisible(false)
        }

        !!window && window.addEventListener("click", isOutsideClick, true)
        return () => {
            if (!window) return
            window.removeEventListener("click", isOutsideClick, true)
        }
    }, [])

    // Height 소수점 올림 값
    const getHeight = useCallback((item: Element) => {
        return Math.ceil(item.getBoundingClientRect().height)
    }, [])

    /**
     * SelectBox Option 위치 설정
     * @const {number} offsetWidth      생성된 SelectBox의 넓이
     * @const {number} offsetHeight     생성된 SelectBox의 높이
     * @const {number} offsetTop        생성된 SelectBox의 Top 거리 pixels
     * @const {number} offsetLeft       생성된 SelectBox의 Left 거리 pixels
     * @const {number} window.scrollX   브라우저 화면의 가로 스크롤 pixels
     * @const {number} window.scrollY   브라우저 화면의 세로 스크롤 pixels
     * @const {boolean} isTop           상단 Bar에서 호출된 SelectBox 인지 여부
     * @const {boolean} isBoxIn         전체 화면이 아닌 상세 정보 안에서 생성되는 SelectBox 인지 여부
     * @const {number} emptySize        SelectBox와 Option 간의 간격
     * @const {number} optionHeight     SelectBox Option의 높이
     */
    const optionSetPosition = useCallback(() => {
        if (selectBoxRef.current) {
            const emptySize = 2
            // SelectBox의 width, height, top, left
            const selHeight = getHeight(selectBoxRef.current)
            const { offsetTop: selectBoxTop, offsetLeft: selectBoxLeft } = selectBoxRef.current
            const scrollX = isTop ? document.getElementById("root").scrollLeft : window.scrollX
            let left = selectBoxLeft - scrollX // Option에 적용할 left Pixel 크기
            let top = 0

            if (selHeight) {
                if (selectBoxOptionRef.current) {
                    // SelectBox가 존재하면서 OptionBox가 노출된 경우만 위치 설정
                    const elRef = ref && ref.current
                    const optionHeight = getHeight(selectBoxOptionRef.current)
                    let boxPosition = selectBoxTop + optionHeight + emptySize
                    if (elRef) {
                        // 테이블에서 생성된 SelectBox일 경우 설정
                        if (isTableIn) {
                            const tableHeaderHeight = getHeight(elRef.getElementsByClassName("em-table-head")[0])
                            top += elRef.offsetTop + tableHeaderHeight
                            left += elRef.offsetLeft
                        }

                        // 넘어온 ref 정보가 있을 경우 SelectBox Option 위치 재정의
                        top -= elRef.scrollTop
                        if (!isBoxIn && !isTableIn) {
                            // 테이블이나 Div Box 안이 아닌 곳에서 호출하는 경우에는 스크롤 위치 적용
                            top += window.scrollY
                            left += scrollX
                        }
                        boxPosition += top
                    }

                    let optionCount = boxPosition + selHeight - window.scrollY - window.innerHeight
                    if (elRef) optionCount -= elRef.scrollTop

                    // SelectBox Option이 하단에 있어 아랫부분이 일부만 보이는 경우인지 확인 후 Option에 적용할 top Pixel 크기 설정
                    if (optionCount > 0) top += selectBoxTop - optionHeight - emptySize - window.scrollY // 상단으로 노출
                    else top += selectBoxTop + selHeight + emptySize - (isTop ? 0 : window.scrollY) // 하단으로 노출
                }

                const option = { top: `${top}px`, left: `${left}px` }
                setOptionStyle(option)
            } else {
                setVisible(false)
            }
        }
    }, [optionStyle])

    /** Input Change Event */
    const inputHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        const timeCheck = isValidTimeFormat(getTimeDigits(value))
        timeCheck && setCurrentItem(prev => ({ ...prev, value }))
    }, [])

    /** Input Key Event */
    const inputKeyHandler = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === "Tab") {
            e.key === "Enter" && e.currentTarget.blur()
            setVisible(false)
        }
    }, [])

    /** Input Blur Event */
    const inputBlurHandler = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            const value = getTimeDigits(e.target.value)
            if (currentItem.value !== value) {
                setCurrentItem(prev => ({ ...prev, value }))
                onChange({ value })
            }
        },
        [onChange]
    )

    /** SelectBox Renderer
     * @param isEdit 입력 가능 여부
     */
    const selectBoxRenderer = useCallback(() => {
        const value = currentItem?.label ?? currentItem?.value ?? defaultLabel
        const keyValue = document.getElementsByClassName("em-select-box").length
        const customLi = typeof customLiRenderer === "function"
        return isEdit ? (
            <>
                <input
                    key={`input_${keyValue}`}
                    className={"select-content"}
                    onClick={() => !disabled && setVisible(!visible)}
                    onChange={e => inputHandler(e)}
                    onKeyDown={e => inputKeyHandler(e)}
                    onBlur={e => inputBlurHandler(e)}
                    value={value}
                    disabled={disabled}
                />
                <span className={cx("select-icon", { expend: visible })} />
            </>
        ) : (
            <p
                key={`select_${keyValue}`}
                className={cx("select-content", { expend: visible, disabled })}
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                    e.stopPropagation()
                    !disabled && setVisible(!visible)
                }}
                onMouseEnter={e => tooltipHandler(e, true, value)}
                onMouseLeave={() => setOnMouse(false)}>
                {customLi
                    ? customLiRenderer({
                          label: currentItem?.label,
                          value: currentItem?.value,
                          data: currentItem?.data,
                      })
                    : value}
            </p>
        )
    }, [defaultLabel, currentItem, visible, disabled])

    // list Item
    const Li = useCallback(
        ({ customLiRenderer, item }: { customLiRenderer: (item: SelectBoxItem) => JSX.Element; item: SelectBoxItem }) => {
            return (
                <>
                    <li
                        key={item.value}
                        onClick={e => handleChange(e, item)}
                        onMouseEnter={e => tooltipHandler(e, true, item.label ?? item.value)}
                        onMouseLeave={() => setOnMouse(false)}>
                        {typeof customLiRenderer === "function" ? (
                            customLiRenderer({ label: item.label, value: item.value, data: item.data })
                        ) : (
                            <span>{item.label ?? item.value}</span>
                        )}
                    </li>
                </>
            )
        },
        [selectItems, onChange]
    )

    return (
        <div className={cx("em-select-box", classList)} ref={selectBoxRef}>
            {selectBoxRenderer()}
            <div className={cx("select-option scroll", { visible: visible })} style={optionStyle} ref={selectBoxOptionRef}>
                <ul
                    onClick={() => {
                        // children 클릭시 옵션 닫힘
                        !!children && setVisible(false)
                    }}>
                    {children}
                    {selectItems.map((item: SelectBoxItem) => (
                        <Li customLiRenderer={customLiRenderer} item={item} key={item.value} />
                    ))}
                </ul>
            </div>
        </div>
    )
})

SelectBox.displayName = "SelectBox"

export default React.memo(SelectBox)
