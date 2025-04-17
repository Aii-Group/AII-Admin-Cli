import { useEffect, useState } from 'react'
import i18n from 'i18next'
import type { Locale } from 'antd/es/locale'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import { getBrowserLang } from '@/utils/system'
import { languageEnums } from '@/enums/languageEnum'
import { useLanguageStore } from '@/stores/system'
function useLanguage() {
  const { language, setLanguage } = useLanguageStore()
  const [locale, setLocal] = useState<Locale>(zhCN)
  const setAntdLanguage = () => {
    if (language && language == languageEnums.ZH) return setLocal(zhCN)
    if (language && language == languageEnums.EN) return setLocal(enUS)
    if (getBrowserLang() == languageEnums.ZH) return setLocal(zhCN)
    if (getBrowserLang() == languageEnums.EN) return setLocal(enUS)
  }
  useEffect(() => {
    setLanguage(language || getBrowserLang())
    i18n.changeLanguage(language || getBrowserLang())
    setAntdLanguage()
  }, [language])

  return {
    locale,
  }
}

export default useLanguage
