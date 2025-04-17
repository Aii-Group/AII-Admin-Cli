import { XProvider } from '@ant-design/x'
import { RouterProvider } from 'react-router-dom'

import { router } from '@/router'
import AppProvider from '@/components/AppProvider'
import { DrawerProvider } from '@/components/AiiDrawer'
import { DEFAULT_ICON_CONFIGS, IconProvider } from '@icon-park/react'

import useTheme from './hooks/theme.hooks'
import useLanguage from './hooks/language.hooks'

const IconConfig = { ...DEFAULT_ICON_CONFIGS, prefix: 'icon', size: 18 }

function App() {
  const { locale } = useLanguage()
  const { themeAlgorithm, color } = useTheme()
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
            <RouterProvider router={router} />
          </DrawerProvider>
        </IconProvider>
      </AppProvider>
    </XProvider>
  )
}

export default App
