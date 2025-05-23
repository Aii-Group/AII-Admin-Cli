import { useEffect } from 'react'
import { XProvider } from '@ant-design/x'

import AppRouter from '@/router'
import AppProvider from '@/components/AppProvider'
import { DrawerProvider } from '@/components/AiiDrawer'
import { DEFAULT_ICON_CONFIGS, IconProvider } from '@icon-park/react'

import useTheme from './hooks/theme.hooks'
import useLanguage from './hooks/language.hooks'
import { useThemeStore, useLanguageStore } from './stores/system'

const IconConfig = { ...DEFAULT_ICON_CONFIGS, prefix: 'icon', size: 18 }

import { isMicroAppEnv } from '@/utils/micro'

function App() {
  const { setTheme } = useThemeStore()
  const { setLanguage } = useLanguageStore()
  const { locale } = useLanguage()
  const { themeAlgorithm, color } = useTheme()

  useEffect(() => {
    isMicroAppEnv &&
      window.microApp.addGlobalDataListener((data: any) => {
        if (data.language) {
          setLanguage(data.language)
        }
        if (data.theme) {
          setTheme(data.theme)
        }
      })
  }, [])

  return (
    <XProvider
      locale={locale}
      theme={{
        token: { ...color, borderRadius: 8 },
        algorithm: themeAlgorithm,
      }}
    >
      <AppProvider>
        <IconProvider value={IconConfig}>
          <DrawerProvider>
            <AppRouter />
          </DrawerProvider>
        </IconProvider>
      </AppProvider>
    </XProvider>
  )
}

export default App
