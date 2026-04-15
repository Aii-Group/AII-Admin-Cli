import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enSystem from '@/locales/en.yaml'
import zhSystem from '@/locales/zh.yaml'
import { languageEnums } from '@/enums'

type YamlModule = { default: Record<string, unknown> }

const mergeBusinessModules = (modules: Record<string, YamlModule>) =>
    Object.values(modules).reduce<Record<string, unknown>>((acc, { default: chunk }) => ({ ...acc, ...chunk }), {})

const enBusiness = mergeBusinessModules(
    import.meta.glob('../locales/business/**/en.yaml', { eager: true }) as Record<string, YamlModule>,
)
const zhBusiness = mergeBusinessModules(
    import.meta.glob('../locales/business/**/zh.yaml', { eager: true }) as Record<string, YamlModule>,
)

const enTranslation = { ...enSystem, ...enBusiness }
const zhTranslation = { ...zhSystem, ...zhBusiness }

i18n.use(initReactI18next).init({
    resources: {
        [languageEnums.EN]: {
            translation: enTranslation,
        },
        [languageEnums.ZH]: {
            translation: zhTranslation,
        },
    },
    fallbackLng: languageEnums.ZH,
    debug: false,
    interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
    },
})

export default i18n
