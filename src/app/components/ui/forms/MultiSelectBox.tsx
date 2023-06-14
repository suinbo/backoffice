import React, { forwardRef, MutableRefObject, Ref, useCallback, useEffect, useMemo, useRef, useState } from "react"
import cx from "classnames"
import { MultiSelectBoxItem, OptionStyleProp, sizeCheckProp } from "@/components/ui/forms/types"
import { useToolTip } from "@/contexts/ToolTipContext"
import SelectCheckBox from "@/components/ui/forms/SelectCheckBox"
import { useTranslation } from "react-i18next"
import { T_NAMESPACE } from "@/utils/resources/constants"

const defaultOptionValue: OptionStyleProp = {
    top: "0px",
}

const defaultSizeValue: sizeCheckProp = {
    width: innerWidth,
    height: innerHeight,
    scrollX: scrollX,
    scrollY: scrollY,
}

export type MultiSelectBoxProp = {
    keyName?: string
    items: MultiSelectBoxItem[]
    onChange?: (item: MultiSelectBoxItem[]) => void
    classList?: Array<string> | string
    isTop?: boolean // 최상단 위치여부
    isBoxIn?: boolean // 부모컴포넌트 여부
    hasAll?: boolean //전체 체크박스 추가 여부
    disabled?: boolean
}

/**
 * @description MultiSelect Box
 */
const MultiSelectBox = forwardRef((props: MultiSelectBoxProp, ref: Ref<HTMLDivElement>) => {
    const {
        items,
        onChange,
        classList,
        isBoxIn,
        isTop,
        hasAll = false,
        disabled = false, // edit 모드 사용여부
    } = props

    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
    const { tooltipHandler, setOnMouse } = useToolTip()
    const [optionStyle, setOptionStyle] = useState<OptionStyleProp>(defaultOptionValue)

    //window 객체 width 참고 state
    const [windowSizeProps, setWindowSizeProps] = useState<sizeCheckProp>(defaultSizeValue)
    // 토글 활성화 여부
    const [toggle, setToggle] = useState<boolean>(false)

    const selectBoxRef = useRef<HTMLDivElement>(null)
    const selectBoxOptionRef = useRef<HTMLDivElement>(null)

    /**
     * SelectBox 외부 영역 클릭 시 숨김 처리
     */
    useEffect(() => {
        const isOutsideClick = (e: MouseEvent) => {
            if (!selectBoxRef.current?.contains(e.target as Node)) setToggle(false)
        }

        !!window && window.addEventListener("click", isOutsideClick)
        return () => {
            if (!window) return
            window.removeEventListener("click", isOutsideClick)
        }
    }, [])

    /**
     * 브라우저 스크롤 이벤트 발생할 경우 SelectBox Option 위치 변경
     */
    const isScroll = useCallback(() => {
        if (toggle && selectBoxRef.current) {
            const scrollX = isTop ? document.getElementById("root").scrollLeft : window.scrollX
            setWindowSizeProps(prev => ({ ...prev, scrollX, scrollY: window.scrollY }))
        }
    }, [windowSizeProps, ref, toggle, isTop])

    useEffect(() => {
        const isVisible = () => {
            if (selectBoxRef.current) setToggle(false)
        }

        !!window && window.addEventListener("resize", isResize)
        !!window && window.addEventListener("scroll", isScroll)

        /** 상단 셀렉트박스일 경우 scroll 감지 */
        const elRoot = document.getElementById("root")
        isTop && elRoot.addEventListener("scroll", isScroll)
        if (ref) (ref as MutableRefObject<HTMLDivElement>).current.addEventListener("scroll", isVisible)

        optionSetPosition()

        return () => {
            !!window && window.removeEventListener("resize", isResize)
            !!window && window.removeEventListener("scroll", isScroll)
            isTop && elRoot.removeEventListener("scroll", isScroll)
        }
    }, [windowSizeProps, toggle, ref])

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
            const { offsetHeight, offsetTop, offsetLeft } = selectBoxRef.current // SelectBox의 width, height, top, left
            const scrollX = isTop ? document.getElementById("root").scrollLeft : window.scrollX
            let left = offsetLeft - scrollX // Option에 적용할 left Pixel 크기
            let top = 0

            if (offsetHeight) {
                if (selectBoxOptionRef.current) {
                    const { offsetHeight: optionHeight } = selectBoxOptionRef.current
                    const boxPosition = offsetTop + optionHeight + emptySize

                    // SelectBox Option이 하단에 있어 아랫부분이 일부만 보이는 경우인지 확인 후 Option에 적용할 top Pixel 크기 설정
                    if (boxPosition - window.scrollY - window.innerHeight > 0) top = offsetTop - optionHeight - emptySize - window.scrollY
                    else top = offsetTop + offsetHeight + emptySize - (isTop ? 0 : window.scrollY)
                }

                if (ref) {
                    // ref가 넘어왔을 경우
                    const elRef = (ref as MutableRefObject<HTMLDivElement>).current
                    top -= elRef.scrollTop
                    if (!isBoxIn) {
                        // Box 안에서 호출하는 경우에는 스크롤 위치 적용 하지 않음
                        top += window.scrollY
                        left += scrollX
                    }
                }

                const option = {
                    top: `${top}px`,
                    left: `${left}px`,
                }

                setOptionStyle(option)
            } else {
                setToggle(false)
            }
        }
    }, [optionStyle])

    /**
     * SelectBox Label
     */
    const selectLabel = useMemo(() => {
        const selected = items.filter(item => item.isChecked)
        if (selected.length === 1) return selected[0].label
        else if (selected.length === items.length) return g("label.all")
        else return g("label.multiChoice", { val: selected.length })
    }, [items])

    // 브라우저 화면 크기 변경될 경우 SelectBox Option 위치 변경
    const isResize = useCallback(() => {
        if (selectBoxRef.current) {
            setWindowSizeProps(prev => ({ ...prev, width: window.innerWidth, height: window.innerHeight }))
        }
    }, [windowSizeProps, ref])

    const keyValue = document.getElementsByClassName("em-select-box").length

    /**
     * 체크박스 renderer
     */
    const CheckBoxRenderer = useMemo(() => {
        return <SelectCheckBox useAllCheckbox={hasAll} items={items} onChange={onChange} />
    }, [items])

    return (
        <div className={cx("em-select-box", classList)} ref={selectBoxRef}>
            <p
                key={`select_${keyValue}`}
                className={cx("select-content", { expend: toggle })}
                onClick={() => !disabled && setToggle(!toggle)}
                onMouseEnter={e => tooltipHandler(e, true, selectLabel)}
                onMouseLeave={() => setOnMouse(false)}>
                {selectLabel}
            </p>
            <div className={cx("select-option scroll", { visible: toggle })} style={optionStyle} ref={selectBoxOptionRef}>
                {CheckBoxRenderer}
            </div>
        </div>
    )
})

MultiSelectBox.displayName = "MultiSelectBox"
export default React.memo(MultiSelectBox)
