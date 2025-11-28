import { Button } from 'antd'

import { Moon, SunOne } from '@icon-park/react'
import { useThemeStore } from '@/stores/system'

const ThemeButton: React.FC = () => {
    const { theme, setTheme } = useThemeStore()
    const enableTransitions = () =>
        'startViewTransition' in document && window.matchMedia('(prefers-reduced-motion: no-preference)').matches

    const handleThemeToggle = async (event: unknown) => {
        const { clientX: x, clientY: y } = event as MouseEvent
        const isDark = theme === 'dark'

        if (!enableTransitions()) {
            setTheme(theme === 'light' ? 'dark' : 'light')
            return
        }

        const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px at ${x}px ${y}px)`,
        ]

        await document.startViewTransition(async () => {
            setTheme(theme === 'light' ? 'dark' : 'light')
        }).ready

        document.documentElement.animate(
            { clipPath: !isDark ? clipPath.reverse() : clipPath },
            {
                duration: 500,
                easing: 'ease-in',
                fill: 'both',
                pseudoElement: `::view-transition-${!isDark ? 'old' : 'new'}(root)`,
            },
        )
    }

    const icon = theme === 'light' ? <SunOne /> : <Moon />

    return <Button type="text" icon={icon} onClick={handleThemeToggle} />
}

export default ThemeButton
