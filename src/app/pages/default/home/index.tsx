import React from "react"
import "./style.scss"

const imageSrc = `https://cdn.pixabay.com/photo/2015/07/10/15/13/building-839362_1280.jpg`

const Home = () => {
    return (
        <div
            className="home-wrapper"
            style={{
                backgroundImage: `url(${imageSrc})`,
            }}>
            <div className="home-message">
                <div className="message-box"></div>
            </div>
        </div>
    )
}

export default React.memo(Home)
