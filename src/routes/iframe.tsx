import Layouts from '@/layouts/index'
import { createFileRoute } from '@tanstack/react-router'

/** 外链内嵌布局：与登录后工作台共用壳层（侧栏/页签），路由树独立于 `_authentication`。 */
export const Route = createFileRoute('/iframe')({
    component: Layouts,
})
