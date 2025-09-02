<template>
  <div class="p-4">
    <UCard>
      <UVerticalNavigation :links="links" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
const links = [
  { label: 'Accueil', to: '/' },
  { label: 'Utilisateurs', to: '/users' },
  { label: 'Paramètres', to: '/settings' }
]
</script>
