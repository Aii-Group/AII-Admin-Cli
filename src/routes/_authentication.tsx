import Layouts from '@/layouts/index'
import { createFileRoute } from '@tanstack/react-router'

/** 认证区内路由，与登录后工作台共用壳层（侧栏/页签），路由树独立于 `__root`。 */
export const Route = createFileRoute('/_authentication')({
    component: Layouts,
    beforeLoad: () => {
        // 根据需求自定义 throw redirect({ to: xxx })
    },
})
