import { Avatar, Typography } from 'antd'

import { importImg } from '@/utils/common'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authentication/_dashboard/dashboard')({
    component: RouteComponent,
    staticData: {
        code: 'Dashboard',
        langCode: 'Menu.Dashboard',
    },
})

function RouteComponent() {
    return (
        <>
            <div className="wrapper text-center">
                <Avatar className="mb-20" size={100} src={importImg('png', 'logo.png')} />
                <Typography.Title level={2}>Welcome AII Admin CLI</Typography.Title>
            </div>
        </>
    )
}
