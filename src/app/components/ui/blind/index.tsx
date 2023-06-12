import React from 'react'
import './styles.scss'

const Blind = ({ text }: { text: string }) => {
    return <div className="no-result">{text}</div>
}

export default React.memo(Blind)
