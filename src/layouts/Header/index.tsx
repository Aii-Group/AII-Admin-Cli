import { Divider } from 'antd'

import { importImg } from '@/utils/utils'
import { useLanguageStore, useThemeStore } from '@/stores/system'

import { FullscreenButton, LanguageButton, RemindButton, ThemeButton, UserAvatar } from '@/layouts/components'

export default function Header() {
    const { theme } = useThemeStore()
    const { language } = useLanguageStore()
    const Logo = importImg('png', `asiainfo-${theme}-${language}.png`)

    return (
        <div className="dark:bg-colorBgContainer! dark:border-colorBorder! box-border flex h-15 w-full items-center justify-between px-6 py-2.5 dark:border-b!">
            <div className="flex items-center">
                <img src={Logo} alt="logo" className="h-10" />
            </div>
            <div className="flex items-center gap-2.5">
                <RemindButton />
                <ThemeButton />
                <LanguageButton />
                <FullscreenButton />
                <Divider vertical />
                <UserAvatar />
            </div>
        </div>
    )
}
