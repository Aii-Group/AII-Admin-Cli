import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import { createRootRouteWithContext, Outlet, redirect, useMatches } from '@tanstack/react-router'

interface RootRouteContext {
    token: string
    permissions: string[]
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
    component: () => {
        const { t } = useTranslation()
        const locationCur = useMatches().find((item) => item.pathname === location.pathname)
        const key = locationCur?.staticData?.key as string | undefined
        const titleMenuKey =
            key === 'Iframe' && locationCur?.params && 'name' in locationCur.params
                ? (locationCur.params as { name: string }).name
                : key

        useEffect(() => {
            document.title = titleMenuKey
                ? `${t('System.System_Name')} | ${t(`Menu.${titleMenuKey}`)}`
                : t('System.System_Name')
        }, [titleMenuKey, t])

        return <Outlet />
    },
    beforeLoad: (ctx) => {
        if (location.pathname === '/') {
            throw redirect({ to: '/dashboard' })
        }
    },
})
