import { useEffect } from 'react'

import FullMode from './FullMode'
import { useMatches, useLocation } from '@tanstack/react-router'
import { useTabStore } from '@/stores/system'

export default function Layouts() {
    const { pathname } = useLocation()
    const { addTab } = useTabStore()
    const match = useMatches().find((item) => item.pathname === pathname)

    useEffect(() => {
        const routeKey = match?.staticData?.key as string | undefined
        if (!routeKey) return

        const isIframe = routeKey === 'Iframe'
        const params = match.params as { name?: string }
        const search = match.search as { url?: string }

        addTab({
            key: isIframe ? (params.name ?? routeKey) : routeKey,
            path: match.pathname,
            closeable: routeKey !== 'Dashboard',
            link: isIframe ? (search.url ?? '') : '',
        })
    }, [match, pathname, addTab])

    return <FullMode />
}
