import { computed } from 'vue'
import { locales, type Locale } from '~/locales'

export const useI18n = () => {
  const gameStore = useGameStore()

  const currentLocale = computed(() => gameStore.locale)

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
    gameStore.locale = locale
  }

  return {
    t,
    locale: currentLocale,
    setLocale,
    messages
  }
}

