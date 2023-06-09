import React from 'react'
import './styles.scss'

const top = React.lazy(() => import('./Top'))
const aside = React.lazy(() => import('./Aside'))
const body = React.lazy(() => import('./Body'))

export default {
    top,
    aside,
    body,
}
