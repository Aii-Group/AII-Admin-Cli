import { createFileRoute, useParams } from '@tanstack/react-router'
import React from 'react'

export const Route = createFileRoute('/_authentication/iframe/$name')({
    validateSearch: (search: Record<string, unknown>) => {
        return {
            url: typeof search.url === 'string' ? search.url : '',
        }
    },
    component: () => <IframePage />,
    staticData: {
        code: 'Iframe',
        langCode: '',
    },
})

const IframePage: React.FC = () => {
    const { url } = Route.useSearch()
    const decodedSrc = url ? decodeURIComponent(url) : ''

    if (!decodedSrc) {
        return <div>Invalid external link address</div>
    }

    return (
        <iframe src={decodedSrc} style={{ width: '100%', height: '100%', border: 'none' }} title="External Content" />
    )
}
