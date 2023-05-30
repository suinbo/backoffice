import React from 'react'
import './style.scss'
//import homeLogoImagePath from '@assets/images/home-logo.svg'

// IMAGE 공통 컴포넌트 구현
const imageSrc = `https://${process.env.CF_DOMAIN}/homeimage/home-bg.png`

const Home = () => {
    return (
        <div
            className="home-wrapper"
            style={{
                backgroundImage: `url(${imageSrc})`,
            }}>
            <div className="home-message">
                <div className="message-box">
                    <p className="message-title">
                        새롭게 단장한
                        <br />
                        뉴티빙 백오피스를 소개합니다.
                    </p>
                    <p className="message">
                        2022년 9월 19일 오픈되었습니다.
                        <br />
                        앞으로 CMS의 메뉴가 순차적으로 이관될 예정입니다.
                    </p>
                    <p className="sub-message">지금 새로운 뉴티빙 백오피스를 만나보세요!</p>
                </div>
            </div>
            {/* <img src={homeLogoImagePath} title="" className="home-logo" /> */}
        </div>
    )
}

export default React.memo(Home)
