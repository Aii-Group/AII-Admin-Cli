import { Button, Dropdown } from 'antd'
import { useTranslation } from 'react-i18next'

import { Earth } from '@icon-park/react'
import { useLanguageStore } from '@/stores/system'

const LanguageButton: React.FC = () => {
    const { t } = useTranslation()
    const { language, setLanguage } = useLanguageStore()

    const items = [
        {
            key: 'zh',
            label: t('System.zh'),
            onClick: () => setLanguage('zh'),
        },
        {
            key: 'en',
            label: t('System.en'),
            onClick: () => setLanguage('en'),
        },
    ]
    return (
        <Dropdown menu={{ items, selectable: true, defaultSelectedKeys: [language] }}>
            <Button type="text" icon={<Earth />} />
        </Dropdown>
    )
}

export default LanguageButton
