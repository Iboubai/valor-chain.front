<!-- pages/index.vue -->
<script setup lang="ts">
// Cette page est protégée par le middleware global de nuxt-auth
// Si l'utilisateur n'est pas connecté, il sera redirigé vers /connexion
definePageMeta({
  // Vous pouvez ajouter des métadonnées spécifiques à la page ici si nécessaire
})

const { data: user, signOut } = useAuth()
const userFirstName = computed(() => user.value?.data?.firstName || '')
const userFullName = computed(() => `${user.value?.data?.firstName || ''} ${user.value?.data?.lastName || ''}`.trim())

</script>

<template>
  <div>
    Bienvenue sur votre tableau de bord, {{ userFullName }} !
    <!-- Titre de la page --
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Tableau de bord</h1>
      <p class="text-gray-500 dark:text-gray-400">Bienvenue, {{ user?.name }}. Voici un aperçu de votre compte.</p>
    </div>

    <!-- Grille de cartes pour le contenu --
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Carte 1 --
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-wallet" class="w-5 h-5" />
            <h3 class="font-semibold">Solde Principal</h3>
          </div>
        </template>
        <p class="text-2xl font-bold">1,234.56 €</p>
        <p class="text-sm text-green-500">+5.2% depuis hier</p>
      </UCard>

      <!-- Carte 2 --
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-chart-pie" class="w-5 h-5" />
            <h3 class="font-semibold">Valeur des Actifs</h3>
          </div>
        </template>
        <p class="text-2xl font-bold">5,678.90 €</p>
        <p class="text-sm text-gray-500">3 actifs différents</p>
      </UCard>

      <!-- Carte 3 --
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-arrows-right-left" class="w-5 h-5" />
            <h3 class="font-semibold">Dernière Transaction</h3>
          </div>
        </template>
        <p class="text-lg font-medium">Achat de "Token A"</p>
        <p class="text-sm text-gray-500">Il y a 2 heures</p>
      </UCard>
    </div>

    <!-- Vous pouvez ajouter d'autres sections ici --
    <div class="mt-8">
      <UCard>
        <template #header>
          <h3 class="font-semibold">Activité Récente</h3>
        </template>
        <p>Un tableau ou une liste de vos dernières activités...</p>
      </UCard>
    </div>-->
  </div>
</template>
