import { useEffect, useMemo } from 'react'

import { ConfigProvider } from 'antd'
import router from '@/utils/router'
import { isMicroAppEnv } from '@/utils/micro'
import AppProvider from '@/components/AppProvider'
import { DrawerProvider } from '@/components/AiiDrawer'
import { ModalProvider } from '@/components/AiiModal'
import { RouterProvider } from '@tanstack/react-router'
import { DEFAULT_ICON_CONFIGS, IconProvider } from '@icon-park/react'
import { components } from './styleToken'

import useTheme from './hooks/theme.hooks'
import useLanguage from './hooks/language.hooks'
import { useLanguageStore, useThemeStore, useUserStore } from './stores/system'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const IconConfig = { ...DEFAULT_ICON_CONFIGS, prefix: 'icon', size: 18 }

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: false,
        },
    },
})

function App() {
    const setTheme = useThemeStore((state) => state.setTheme)
    const setColor = useThemeStore((state) => state.setColor)
    const setLanguage = useLanguageStore((state) => state.setLanguage)
    const { locale } = useLanguage()
    const { themeAlgorithm, color } = useTheme()
    const userInfo = useUserStore((state) => state.userInfo)
    const setUserInfo = useUserStore((state) => state.setUserInfo)

    const theme = useMemo(
        () => ({
            token: { ...color, borderRadius: 8 },
            algorithm: themeAlgorithm,
            components,
        }),
        [color, themeAlgorithm],
    )

    const routerContext = useMemo(
        () => ({ token: userInfo.token, permissions: userInfo.permissions }),
        [userInfo.token, userInfo.permissions],
    )

    useEffect(() => {
        isMicroAppEnv &&
            window.microApp.addGlobalDataListener((data: any) => {
                if (data.lang) {
                    setLanguage(data.lang)
                }
                if (data.theme) {
                    setTheme(data.theme)
                }
                if (data.userInfo) {
                    setUserInfo({
                        ...useUserStore.getState().userInfo,
                        ...data.userInfo,
                        permissions: data.permissionsButton ?? [],
                    })
                }
                if (data.brandColor) {
                    setColor(data.brandColor)
                }
            }, true)
    }, [setLanguage, setTheme, setColor, setUserInfo])

    return (
        <ConfigProvider locale={locale} theme={theme}>
            <AppProvider>
                <IconProvider value={IconConfig}>
                    <QueryClientProvider client={queryClient}>
                        <DrawerProvider>
                            <ModalProvider>
                                <RouterProvider router={router} context={routerContext} />
                            </ModalProvider>
                        </DrawerProvider>
                    </QueryClientProvider>
                </IconProvider>
            </AppProvider>
        </ConfigProvider>
    )
}

export default App
