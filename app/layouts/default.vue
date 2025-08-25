<!-- layouts/default.vue -->
<script setup lang="ts">
const { data: user, signOut } = useAuth()

// Définition des liens de navigation pour la barre latérale
const links = [
  { label: 'Tableau de bord', icon: 'i-heroicons-squares-2x2', to: '/' },
  { label: 'Mes Actifs', icon: 'i-heroicons-chart-pie', to: '/actifs' },
  { label: 'Transactions', icon: 'i-heroicons-arrows-right-left', to: '/transactions' },
  { label: 'Profil', icon: 'i-heroicons-user-circle', to: '/profil' },
  { label: 'Paramètres', icon: 'i-heroicons-cog-6-tooth', to: '/parametres' }
]

const isMobileMenuOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- ================================= -->
    <!-- ==      BARRE LATÉRALE         == -->
    <!-- ================================= -->
    <aside class="hidden md:flex fixed top-0 left-0 h-full w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 transition-transform">
      <div class="flex items-center gap-2 mb-8">
        <UIcon name="i-heroicons-shield-check-solid" class="h-8 w-8 text-green-500" />
        <span class="font-bold text-xl">Valor-Chain</span>
      </div>
      
      <UVerticalNavigation :links="links" />
    </aside>

    <!-- ================================= -->
    <!-- ==   HEADER ET CONTENU PRINCIPAL == -->
    <!-- ================================= -->
    <div class="md:ml-64">
      <!-- HEADER -->
      <header class="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/75 dark:bg-gray-900/75 backdrop-blur-lg px-4 sm:px-6 lg:px-8 h-16">
        <!-- Bouton pour menu mobile -->
        <UButton
          class="md:hidden"
          color="gray"
          variant="ghost"
          icon="i-heroicons-bars-3"
          @click="isMobileMenuOpen = true"
        />
        
        <div class="flex-1"></div> <!-- Espaceur -->

        <!-- Menu Profil -->
        <div class="flex items-center gap-4">
          <LangSwitcher /> <!-- On réutilise le sélecteur de langue ! -->
          
          <UDropdown :items="[[{ label: 'Déconnexion', icon: 'i-heroicons-arrow-left-on-rectangle', click: () => signOut() }]]">
            <UButton color="white" variant="ghost" class="flex items-center gap-2">
              <UAvatar :alt="user?.name || 'U'" size="sm" />
              <span class="hidden sm:block font-medium">{{ user?.name }}</span>
            </UButton>
          </UDropdown>
        </div>
      </header>

      <!-- CONTENU DE LA PAGE -->
      <main class="p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>

    <!-- ================================= -->
    <!-- ==       MENU MOBILE (Slide)   == -->
    <!-- ================================= -->
    <USlideover v-model="isMobileMenuOpen">
      <div class="p-4 flex-1">
        <div class="flex items-center gap-2 mb-8">
          <UIcon name="i-heroicons-shield-check-solid" class="h-8 w-8 text-green-500" />
          <span class="font-bold text-xl">Valor-Chain</span>
        </div>
        <UVerticalNavigation :links="links" @click="isMobileMenuOpen = false" />
      </div>
    </USlideover>
  </div>
</template>
