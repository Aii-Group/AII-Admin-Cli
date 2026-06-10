import { theme } from 'antd'
import { ThemeEnum } from './src/enums/index.ts'

const { getDesignToken, defaultAlgorithm, darkAlgorithm } = theme

const seedToken = {
    colorPrimary: ThemeEnum.colorPrimary,
    colorSuccess: ThemeEnum.colorSuccess,
    colorWarning: ThemeEnum.colorWarning,
    colorError: ThemeEnum.colorError,
}

const lightGlobalToken = getDesignToken({ token: seedToken, algorithm: defaultAlgorithm })
const darkGlobalToken = getDesignToken({ token: seedToken, algorithm: darkAlgorithm })

const toPx = (value) => (typeof value === 'number' ? `${value}px` : value)
const toString = (value) => String(value)

const extractByPrefix = (tokens, prefixes, transform = (value) => value) =>
    Object.fromEntries(
        Object.entries(tokens)
            .filter(([key]) => [prefixes].flat().some((prefix) => key.startsWith(prefix)))
            .map(([key, value]) => [key, transform(value)]),
    )

const toCssVarName = (key) => `--antd-${key}`
const toCssVarValue = (key) => `var(${toCssVarName(key)})`
const toCssVarMap = (tokens) =>
    Object.fromEntries(Object.entries(tokens).map(([key, value]) => [toCssVarName(key), value]))

const lightColors = extractByPrefix(lightGlobalToken, 'color')
const darkColors = extractByPrefix(darkGlobalToken, 'color')

export const antdTokenPlugin = {
    handler({ addBase }) {
        addBase({
            ':root': toCssVarMap(lightColors),
            '.dark': toCssVarMap(darkColors),
        })
    },
}

const preset = {
    colors: Object.fromEntries(Object.keys(lightColors).map((key) => [key, toCssVarValue(key)])),
    fontSize: extractByPrefix(lightGlobalToken, 'fontSize', toPx),
    lineHeight: extractByPrefix(lightGlobalToken, 'lineHeight'),
    fontWeight: {
        strong: lightGlobalToken.fontWeightStrong,
    },
    borderRadius: extractByPrefix(lightGlobalToken, 'borderRadius', toPx),
    boxShadow: extractByPrefix(lightGlobalToken, 'boxShadow'),
    transitionDuration: extractByPrefix(lightGlobalToken, 'motionDuration'),
    transitionTimingFunction: extractByPrefix(lightGlobalToken, 'motionEase'),
    spacing: {
        ...extractByPrefix(lightGlobalToken, ['size', 'padding', 'margin'], toPx),
    },
    height: extractByPrefix(lightGlobalToken, 'controlHeight', toPx),
    zIndex: {
        base: toString(lightGlobalToken.zIndexBase),
        popup: toString(lightGlobalToken.zIndexPopupBase),
    },
    opacity: {
        image: toString(lightGlobalToken.opacityImage),
        loading: toString(lightGlobalToken.opacityLoading),
    },
}

export default preset
