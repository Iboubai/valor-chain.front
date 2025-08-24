import { defineI18nConfig } from '#i18n'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'fr',
  messages: {} // Les messages sont chargés depuis les fichiers JSON
}))
