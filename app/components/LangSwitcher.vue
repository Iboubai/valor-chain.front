<template>
  <select v-model="locale">
    <option v-for="lang in availableLocales" :key="lang.code" :value="lang.code">
      {{ lang.name }}
    </option>
  </select>
</template>

<script setup lang="ts">
const { locale, locales } = useI18n()
const availableLocales = computed(() => {
  return (locales.value as any[]).filter(i => i.code !== locale.value)
})
</script>
