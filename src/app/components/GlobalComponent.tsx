import { ConfirmStateProvider } from '@/contexts/ConfirmContext'
import { ToolTipStateProvider } from '@/contexts/ToolTipContext'
import React from 'react'
// import SessionAlert from './sessionAlert'

const GlobalComponent: React.FC = ({ children }) => {
    return (
        <ConfirmStateProvider>
            <ToolTipStateProvider>
                {/* <SessionAlert /> */}
                {children}
            </ToolTipStateProvider>
        </ConfirmStateProvider>
    )
}

export default GlobalComponent
