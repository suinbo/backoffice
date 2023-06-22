import React, { forwardRef, MutableRefObject, useEffect } from "react"
import cx from "classnames"
import { Close } from "@material-ui/icons"
import { ModalProp } from "./types"
import "./styles.scss"
import { Button } from "../buttons"
import { ButtonStyleType } from "../buttons/types"

const Modal = forwardRef<HTMLDivElement, ModalProp>(
    ({ onClose, headerRenderer, footerRenderer, children, classList, maintain = false }: ModalProp, ref) => {
        const CloseButton = <Close className="no-title-close" onClick={onClose} />
        const CancelButton = <Button styleType={ButtonStyleType.default} onClick={onClose} />

        // 모달창 렌더링 됏을때 백그라운드 스크롤링 막기
        useEffect(() => {
            // 모달 오픈시 스크롤 탑 위치
            if (ref) {
                // eslint-disable-next-line @typescript-eslint/no-extra-semi
                ;(ref as MutableRefObject<HTMLDivElement>).current.scrollTop = 0
            }
            document.body.style.overflow = "hidden"
            return () => {
                if (!!document.querySelector(".modal") && !maintain) document.body.style.overflow = "hidden"
                else document.body.style.overflow = "auto"
            }
        }, [])

        return (
            <div className={cx("modal show", classList)}>
                <div className="form-box">
                    <section>
                        <div className="modal-title">{typeof headerRenderer === "function" ? headerRenderer() : CloseButton}</div>
                        <main className="form">{children}</main>
                        <footer className="button-group">{typeof footerRenderer === "function" ? footerRenderer() : CancelButton}</footer>
                    </section>
                </div>
            </div>
        )
    }
)

Modal.displayName = "Modal"

export default React.memo(Modal)
