import { ref, computed } from 'vue'
import { locales, localeNames, detectBrowserLocale, type Locale } from '~/locales'

// Global reactive locale state
const currentLocale = ref<Locale>('en')
let initialized = false

export const useI18n = () => {
  // Initialize locale from localStorage or browser detection (only once)
  if (!initialized && import.meta.client) {
    const savedLocale = localStorage.getItem('ogame-locale') as Locale | null
    if (savedLocale && savedLocale in locales) {
      currentLocale.value = savedLocale
    } else {
      currentLocale.value = detectBrowserLocale()
    }
    initialized = true
  }

  const messages = computed(() => locales[currentLocale.value])

  // Get translation text helper function
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.')
    let value: any = messages.value

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // Return original key if translation not found
      }
    }

    let result = typeof value === 'string' ? value : key

    // Replace parameter placeholders
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue))
      })
    }

    return result
  }

  const setLocale = (locale: Locale) => {
    currentLocale.value = locale
    if (import.meta.client) {
      localStorage.setItem('ogame-locale', locale)
    }
  }

  return {
    t,
    locale: currentLocale,
    setLocale,
    messages,
    localeNames,
    availableLocales: Object.keys(locales) as Locale[]
  }
}

