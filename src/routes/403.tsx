import { Button, Result } from 'antd'
import { useTranslation } from 'react-i18next'

import Page403 from '@/assets/svg/403.svg?react'
import { createFileRoute, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/403')({
    component: RouteComponent,
    staticData: {
        key: '403',
        langCode: 'Error_Status.403',
    },
})

function RouteComponent() {
    const router = useRouter()
    const { t } = useTranslation()
    return (
        <Result
            icon={<Page403 className="mx-auto h-1/4 w-1/4" />}
            subTitle={t('Error_Status.403')}
            extra={
                <Button type="primary" onClick={() => router.history.back()}>
                    {t('Action.Back')}
                </Button>
            }
        />
    )
}
