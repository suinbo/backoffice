import React from 'react'
import './style.scss'

const Spinner = () => {
    return (
        <div className="loading-wrap">
            <div className="loading dot">
                <span>Loading</span>
                <div>Loading dot1</div>
                <div>Loading dot2</div>
                <div>Loading dot3</div>
            </div>
        </div>
    )
}

export default Spinner
