import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import Logo from '@/assets/png/logo.png'

export const Route = createFileRoute('/_authentication/dashboard')({
    component: RouteComponent,
    staticData: { key: 'Dashboard' },
})

function RouteComponent() {
    const { t } = useTranslation()
    return (
        <div className="wrapper flex h-full flex-col items-center justify-center gap-4 font-mono text-2xl font-bold">
            <img src={Logo} alt="logo" className="h-24" />
            {t('Dashboard.Title')}
        </div>
    )
}
