import { ReactNode, useEffect } from 'react'

import { Navigate, useRouteLoaderData } from 'react-router-dom'

import { useTabStore, useUserStore } from '@/stores/system'

interface Meta {
  requiredAuth?: boolean
  code: string
  closeable: boolean
  path: string
}

interface RouterGuardProps {
  children: ReactNode
  meta?: Meta
}

const RouterGuard: React.FC<RouterGuardProps> = (props) => {
  const { userInfo } = useUserStore()
  const { addTab } = useTabStore()
  const loaderData = useRouteLoaderData('root') as string[]

  const accessToken = userInfo?.accessToken

  const { meta } = props

  useEffect(() => {
    meta?.code && addTab(meta)
  }, [meta])

  if (!meta?.requiredAuth) return <>{props.children}</>

  if (!window.__MICRO_APP_ENVIRONMENT__) {
    if (!accessToken) return <Navigate to="/login" replace />
  }

  const staticRouter = ['/', '404', '403']
  const routerList = loaderData?.concat(staticRouter)

  if (meta?.code && !routerList.includes(meta.code)) {
    return <Navigate to="/403" />
  }

  return <>{props.children}</>
}

export default RouterGuard
