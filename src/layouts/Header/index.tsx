import { Divider } from 'antd'

import { importImg } from '@/utils/utils'
import { useLanguageStore, useThemeStore } from '@/stores/system'

import { FullscreenButton, LanguageButton, RemindButton, ThemeButton, UserAvatar } from '@/layouts/components'

export default function Header() {
    const { theme } = useThemeStore()
    const { language } = useLanguageStore()
    const Logo = importImg('png', `asiainfo-${theme}-${language}.png`)

    return (
        <div className="h-15 box-border flex w-full items-center justify-between px-6 py-2.5 dark:!border-b dark:!border-colorBorder dark:!bg-colorBgContainer">
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
