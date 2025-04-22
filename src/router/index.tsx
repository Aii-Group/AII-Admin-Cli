import { createRef, lazy } from 'react'

import { createBrowserRouter, Navigate } from 'react-router-dom'

import Login from '@/pages/login'
import Layout from '@/layouts/index'
import Error403 from '@/pages/error-page/403'
import Error404 from '@/pages/error-page/404'
import { useMenuStore } from '@/stores/system'

import LazyLoad from './lazyLoad'

const menu = useMenuStore.getState().menu

const rootLoader = () => {
  return ['Dashboard', 'Basic_Table', 'Advanced_Table']
}

const modules = import.meta.glob('@/pages/**/*.tsx')

const components = Object.keys(modules).reduce<Record<string, any>>((prev, cur) => {
  prev[cur.replace('/src/pages', '')] = modules[cur]
  return prev
}, {}) as Record<string, () => Promise<any>>

const generateRoutes = (menuList: any[]): any[] => {
  return menuList.map((item) => {
    const component = components[`${item.filePath}.tsx`]
    if (item.children && item.children.length > 0) {
      return {
        path: item.path,
        children: generateRoutes(item.children),
      }
    }

    return {
      path: item.path,
      element: LazyLoad(
        lazy(() => (component ? component() : Promise.reject('Component not found'))),
        {
          requiredAuth: !item.link,
          closeable: item.key !== 'Dashboard',
          code: item.key,
          path: item.path,
          link: item.link,
        },
      ),

      nodeRef: createRef(),
    }
  })
}

export const routes = [
  {
    path: '/',
    element: <Navigate to="/dashboard" />,
  },
  {
    path: '/',
    id: 'root',
    loader: rootLoader,
    children: [
      {
        element: <Layout />,
        children: [
          ...generateRoutes(menu),
          // {
          //   path: '/iframe',
          //   element: LazyLoad(
          //     lazy(() => import('@/pages/iframe')),
          //     {
          //       requiredAuth: false,
          //       closeable: false,
          //       code: 'Iframe',
          //     },
          //   ),
          // },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },

  {
    path: '/403',
    element: <Error403 />,
  },
  {
    path: '/404',
    element: <Error404 />,
  },
  {
    path: '*',
    element: <Error404 />,
  },
]

export const router = createBrowserRouter(routes)
