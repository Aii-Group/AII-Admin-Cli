import { Button, Result } from 'antd'
import { useTranslation } from 'react-i18next'

import Page404 from '@/assets/svg/404.svg?react'
import { useRouter } from '@tanstack/react-router'

export default function Error404() {
    const router = useRouter()
    const { t } = useTranslation()
    return (
        <Result
            icon={<Page404 className="mx-auto h-1/4 w-1/4" />}
            subTitle={t('Error_Status.404')}
            extra={
                <Button type="primary" onClick={() => router.history.back()}>
                    {t('Action.Back')}
                </Button>
            }
        />
    )
}
