<!-- components/LangSwitcher.vue -->
<script setup lang="ts">
import { computed } from 'vue'

const { locales, locale, setLocale } = useI18n()

// Crée le nom de l'icône du drapeau à partir du code de la langue (ex: 'fr' -> 'i-circle-flags-fr')
const flagIconName = (code: string): string => {
  // Gère les cas spéciaux comme l'anglais (en -> us) ou le chinois (zh -> cn)
  const countryCode = code === 'en' ? 'us' : (code === 'zh' ? 'cn' : code);
  return `i-circle-flags-${countryCode}`;
}

// Calcule la langue actuellement sélectionnée pour l'afficher dans le bouton principal
const currentLocale = computed(() => {
  return locales.value.find(l => l.code === locale.value)
})

// Formate la liste des langues pour le composant UDropdown
const dropdownItems = computed<DropdownMenuItem[][]>(() => [
  locales.value.map(l => ({
    label: l.name || l.code, // Utilise le nom de la langue, ou le code si le nom n'est pas défini
    icon: flagIconName(l.code),
    click: () => setLocale(l.code) // Change la langue au clic
  }))
])
</script>

<template>
  <UDropdownMenu v-if="currentLocale" :items="dropdownItems" :popper="{ placement: 'bottom-start' }">
    <!-- C'est le bouton principal qui est affiché en permanence -->
    <!-- On utilise un slot personnalisé #default pour contrôler entièrement son apparence -->
    <UButton color="white" variant="ghost" class="p-2">
      <!-- Affiche le drapeau de la langue actuelle -->
      <UIcon :name="flagIconName(currentLocale.code)" class="text-lg" />

      <!-- Affiche le nom de la langue actuelle -->
      <span class="font-semibold text-sm">{{ currentLocale.name }}</span>

      <!-- Affiche la petite flèche vers le bas -->
      <UIcon name="i-heroicons-chevron-down-20-solid" class="w-5 h-5" />
    </UButton>
  </UDropdownMenu>
</template>

<style scoped>
/* Ajoute une petite ligne de séparation verticale comme dans l'image */
/* On utilise la pseudo-classe ::after pour ne pas alourdir le template */
.font-semibold::after {
  content: '|';
  margin-left: 0.5rem; /* 8px */
  margin-right: 0.25rem; /* 4px */
  color: #d1d5db; /* text-gray-300 */
}

.dark .font-semibold::after {
    color: #4b5563; /* dark:text-gray-600 */
}
</style>
