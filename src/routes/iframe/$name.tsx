import { useTranslation } from 'react-i18next'

import { createFileRoute } from '@tanstack/react-router'
import { Empty } from 'antd'

import { isHttpOrHttpsUrl } from '@/utils/system'

export const Route = createFileRoute('/iframe/$name')({
    validateSearch: (search: Record<string, unknown>) => ({
        url: typeof search.url === 'string' && isHttpOrHttpsUrl(search.url) ? search.url : '',
    }),
    staticData: {
        key: 'Iframe',
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { t } = useTranslation()
    const { url } = Route.useSearch()
    const { name } = Route.useParams()

    if (!url) {
        return (
            <div className="min-h-120 flex h-full items-center justify-center">
                <Empty description={t('Common.Invalid_Link')} />
            </div>
        )
    }

    return (
        <iframe
            title={name}
            src={url}
            className="min-h-120 box-border h-full w-full rounded-borderRadiusLG border-0 bg-colorBgContainer"
            referrerPolicy="no-referrer-when-downgrade"
        />
    )
}
