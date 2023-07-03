import { T_NAMESPACE } from '@/utils/resources/constants'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { isValidUrl } from '@/utils/resources/validators'

type TextLinkProps = {
    value: string
    active: boolean
    isImagePathLabel?: boolean
}

const TextLink = ({ value, active = true, isImagePathLabel = true }: TextLinkProps) => {
    const { t } = useTranslation(T_NAMESPACE.GLOBAL)

    /**
     * 이미지 클릭시 새 탭으로 이미지 노출
     * @param obj
     */
    const openOriginImage = (value: string) => {
        if (value) {
            window.open(value)
        }
    }

    return (
        <p className="image-path">
            {isImagePathLabel && t('imagePath', { val: '' })}
            <span className={active && isValidUrl(value) ? 'active' : ''} onClick={() => isValidUrl(value) && openOriginImage(value)}>
                {value}
            </span>
        </p>
    )
}

export default TextLink
