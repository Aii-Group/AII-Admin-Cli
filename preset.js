import { theme } from 'antd'
import plugin from 'tailwindcss/plugin'
import { ThemeEnum } from './src/enums'

const { getDesignToken } = theme

const brandColor = {
    colorPrimary: ThemeEnum.colorPrimary,
    colorSuccess: ThemeEnum.colorSuccess,
    colorWarning: ThemeEnum.colorWarning,
    colorError: ThemeEnum.colorError,
}

const sharedConfig = { token: brandColor }

const lightGlobalToken = getDesignToken({ ...sharedConfig, algorithm: theme.defaultAlgorithm })
const darkGlobalToken = getDesignToken({ ...sharedConfig, algorithm: theme.darkAlgorithm })

const extractByPrefix = (tokens, prefix, appendPx = false) =>
    Object.fromEntries(
        Object.entries(tokens)
            .filter(([key]) => key.startsWith(prefix))
            .map(([key, value]) => [key, appendPx && typeof value === 'number' ? `${value}px` : value]),
    )

const lightColors = extractByPrefix(lightGlobalToken, 'color')
const darkColors = extractByPrefix(darkGlobalToken, 'color')

const toCssVar = (key) => `--antd-${key}`

/**
 * 注入 CSS 变量：:root 对应亮色 token，.dark 对应暗色 token。
 * Tailwind colors 引用变量后，text-colorPrimary 可自动跟随主题切换。
 */
export const antdTokenPlugin = plugin(({ addBase }) => {
    addBase({
        ':root': Object.fromEntries(Object.entries(lightColors).map(([key, value]) => [toCssVar(key), value])),
        '.dark': Object.fromEntries(Object.entries(darkColors).map(([key, value]) => [toCssVar(key), value])),
    })
})

const t = lightGlobalToken

const preset = {
    // CSS 变量自动跟随主题切换，用法：bg-colorPrimary / text-colorText
    colors: Object.fromEntries(Object.keys(lightColors).map((key) => [key, `var(${toCssVar(key)})`])),

    fontSize: extractByPrefix(t, 'fontSize', true),
    lineHeight: extractByPrefix(t, 'lineHeight'),
    fontWeight: {
        strong: t.fontWeightStrong, // 600
    },

    borderRadius: extractByPrefix(t, 'borderRadius', true),

    boxShadow: extractByPrefix(t, 'boxShadow'),

    transitionDuration: extractByPrefix(t, 'motionDuration'),
    transitionTimingFunction: extractByPrefix(t, 'motionEase'),

    spacing: {
        ...extractByPrefix(t, 'size', true),
        ...extractByPrefix(t, 'padding', true),
        ...extractByPrefix(t, 'margin', true),
    },

    height: extractByPrefix(t, 'controlHeight', true),

    zIndex: {
        base: String(t.zIndexBase), // 0
        popup: String(t.zIndexPopupBase), // 1000
    },

    opacity: {
        image: String(t.opacityImage), // 1
        loading: String(t.opacityLoading), // 0.65
    },
}

export default preset
