/**
 * ttag start point
 * Gets locale from localStorage with fallback
 */
import { addLocale, useLocale } from 'ttag'
import UserStorage from './UserStorage'
import { LocaleDate } from './localeFormatDate'
import { LanguageCode } from '../charting_library/charting_library/charting_library'

export const langFromURL: string | null = new URLSearchParams(
  window.location.search
).get('lang')
/**
 * Take language from URL (this is source of truth)
 * If xprops.lang defined - use it
 * otherwise fallback to user language or english
 */
export const locale: LanguageCode = langFromURL
  ? langFromURL
  : (window as any).xprops
  ? ((window as any).xprops.lang ?? UserStorage.getLanguage()) || 'en'
  : UserStorage.getLanguage() || 'en'

export const localeForChart = () => {
  const lang = langFromURL
    ? langFromURL
    : (window as any).xprops
    ? ((window as any).xprops.lang ?? UserStorage.getLanguage()) || 'en'
    : UserStorage.getLanguage() || 'en'
  if (lang === 'zh-tw') return 'zh_TW'
  if (lang === 'zh-cn') return 'zh'
  if (lang === 'ms') return 'ms_MY'
  if (lang === 'id') return 'id_ID'
  return lang
}

if (locale !== 'en') {
  try {
    const translationsObj = require(`./translations/${locale}.po.json`)
    addLocale(locale, translationsObj)
    useLocale(locale) // eslint-disable-line
    LocaleDate.setLocale(locale)
  } catch (e) {
    console.warn(`missing locale: ${locale}, falling back to english locale`)
    const translationsObj = require(`./translations/en.po.json`)
    addLocale('en', translationsObj)
    useLocale('en') // eslint-disable-line
    LocaleDate.setLocale('en')
  }
}
