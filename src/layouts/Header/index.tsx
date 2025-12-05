import { Divider } from 'antd'

import { importImg } from '@/utils/common'
import { useLanguageStore, useThemeStore } from '@/stores/system'

import { AIButton, FullscreenButton, LanguageButton, RemindButton, ThemeButton, UserAvatar } from '../components'

const Header: React.FC = () => {
    const { theme } = useThemeStore()
    const { language } = useLanguageStore()
    const Logo = importImg('png', `asiainfo-${theme}-${language}.png`)

    return (
        <div className="flex items-center justify-between box-border w-full h-60 px-24 py-10 dark:!bg-dark-colorBgContainer dark:!border-b dark:!border-dark-colorBorder">
            <div className="flex items-center gap-4">
                <img src={Logo} alt="logo" className="h-40" />
            </div>
            <div className="flex items-center gap-10">
                <RemindButton />
                <ThemeButton />
                <LanguageButton />
                <FullscreenButton />
                <AIButton />
                <Divider vertical />
                <UserAvatar />
            </div>
        </div>
    )
}
export default Header
