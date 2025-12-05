import { Button } from 'antd'
import { useTranslation } from 'react-i18next'

import { Welcome } from '@ant-design/x'
import AiiChat from '@/components/AiiChat'
import { MessageEmoji } from '@icon-park/react'
import Robot from '@/assets/svg/robot.svg?react'
import { useDrawer } from '@/components/AiiDrawer'

const AIButton: React.FC = () => {
    const { t } = useTranslation()

    const { showDrawer } = useDrawer()
    const handleOpenAI = () => {
        showDrawer(<AiiChat></AiiChat>, {
            title: (
                <Welcome
                    variant="borderless"
                    icon={<Robot className="w-64 h-64" />}
                    title={t('AI.Welcome')}
                    description={t('AI.Description')}
                    className="p-4"
                />
            ),
            size: 800,
        })
    }
    return <Button type="text" icon={<MessageEmoji />} onClick={handleOpenAI} />
}

export default AIButton
