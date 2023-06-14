import React from "react"
import './styles.scss'

const DetailForm: React.FC = ({
    children = null,
}) => {
    return (
        <>
            <div className="form">
                {children}
            </div>
        </>
    )
}

export default DetailForm