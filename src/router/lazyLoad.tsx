import { Suspense } from 'react'

import { Spin } from 'antd'

import RouterGuard from './routerGuard'

const LazyLoad = (Component: React.ComponentType<any>, meta: any = {}) => {
  return (
    <RouterGuard meta={meta}>
      <Suspense fallback={<Spin className="router-spin" />}>
        <Component />
      </Suspense>
    </RouterGuard>
  )
}

export default LazyLoad
