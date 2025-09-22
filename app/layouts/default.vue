<!-- layouts/default.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NavigationMenuItem } from '#ui/types'
import type { DropdownMenuItem } from '@nuxt/ui'

const { data: user, signOut } = useAuth()

// 3. GESTION DU MENU MOBILE
const isMobileMenuOpen = ref(false)

// 4. EXTRACTION DES DONNÉES UTILISATEUR POUR LE TEMPLATE
// On utilise des computed pour rendre le template plus propre et éviter les erreurs si user est null
const userFirstName = computed(() => user.value?.data?.firstName || '')
const userFullName = computed(() => `${user.value?.data?.firstName || ''} ${user.value?.data?.lastName || ''}`.trim())

//{ label: 'Tableau de bord', icon: 'i-heroicons-squares-2x2', to: '/' }

const itemsVerticalNav = ref<NavigationMenuItem[]>([
  // 1. Le point d'entrée : La vue d'ensemble
  {
    label: 'Tableau de bord',
    icon: 'i-heroicons-squares-2x2', // Parfait, icône de vue globale
    to: '/'
  },

  // 2. Le Cœur de l'Exploitation : Les Unités de Production
  {
    label: 'Mon Exploitation',
    icon: 'i-heroicons-map-pin', // Icône de lieu, de "territoire"
    children: [
      { label: 'Parcelles & Cultures', icon: 'i-heroicons-sun', to: '/exploitation/parcelles' }, // Pour l'agricole
      { label: 'Cheptels & Animaux', icon: 'i-heroicons-user-group', to: '/exploitation/cheptels' }, // Pour l'élevage
      { label: 'Bassins & Étangs', icon: 'i-heroicons-waves', to: '/exploitation/bassins' } // Pour l'halieutique
    ]
  },

  // 3. Les Actions Quotidiennes : Le Journal de Bord
  {
    label: 'Opérations',
    icon: 'i-heroicons-calendar-days', // Icône de planification, d'action
    children: [
      { label: 'Planifier une tâche', icon: 'i-heroicons-plus-circle', to: '/operations/planifier' },
      { label: 'Saisir une intervention', icon: 'i-heroicons-pencil-square', to: '/operations/saisir' }, // L'action la plus fréquente !
      { label: 'Historique des activités', icon: 'i-heroicons-clock', to: '/operations/historique' }
    ]
  },

  // 4. La Gestion des Ressources : Le Stock
  {
    label: 'Ressources',
    icon: 'i-heroicons-beaker', // Icône d'intrants, de "science"
    children: [
      { label: 'Stocks (Intrants)', icon: 'i-heroicons-archive-box', to: '/ressources/intrants' },
      { label: 'Matériel & Équipement', icon: 'i-heroicons-wrench-screwdriver', to: '/ressources/materiel' },
      { label: 'Personnel', icon: 'i-heroicons-users', to: '/ressources/personnel' }
    ]
  },

  // 5. Le Résultat du Travail : La Production
  {
    label: 'Productions',
    icon: 'i-heroicons-gift', // Icône de "cadeau", de ce qu'on récolte
    children: [
      { label: 'Récoltes & Ventes', icon: 'i-heroicons-shopping-cart', to: '/productions/recoltes' },
      { label: 'Stocks (Produits)', icon: 'i-heroicons-cube', to: '/productions/stocks' },
      { label: 'Traçabilité', icon: 'i-heroicons-magnifying-glass-circle', to: '/productions/tracabilite' }
    ]
  },

  // 6. L'Analyse et la Synthèse
  {
    label: 'Analyses',
    icon: 'i-heroicons-chart-pie', // Icône universelle pour l'analyse
    children: [
        { label: 'Performances', icon: 'i-heroicons-chart-bar', to: '/analyses/performance' },
        { label: 'Rapports Financiers', icon: 'i-heroicons-banknotes', to: '/analyses/financier' }
    ]
  },

  // 7. Section "Aide" (regroupant le contact)
  {
    label: 'Aide & Support',
    icon: 'i-heroicons-question-mark-circle',
    to: '/support' // ou garder un sous-menu si besoin
  }
])

const isProfileEditorOpen = ref(false)
const showProfilePanel = ref(false)

const openProfilePanel = () => {
  isProfileEditorOpen.value = true
  console.log("Ouverture du panneau de profil")
}

const itemsMenuProfil = ref<DropdownMenuItem[]>([
  {
    label: 'Profile',
    icon: 'i-lucide-user',
    onSelect: openProfilePanel
  },
  {
    label: 'Settings',
    icon: 'i-lucide-cog'
  },
  { 
    label: 'Déconnexion', 
    icon: 'i-heroicons-arrow-left-on-rectangle', 
    click: () => signOut() 
  }
])

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
      
      <!-- CORRECTION : Le composant s'appelle UVerticalNavigation -->
      <!-- <UNavigationMenu :links="itemsVerticalNav" /> -->
      
      <UNavigationMenu orientation="vertical" :items="itemsVerticalNav" class="data-[orientation=vertical]:w-48" />
    </aside>

    <!-- ================================= -->
    <!-- ==   HEADER ET CONTENU PRINCIPAL == -->
    <!-- ================================= -->
    <div class="md:ml-64">
      <!-- HEADER -->
      <header class="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/75 dark:bg-gray-900/75 backdrop-blur-lg px-4 sm:px-6 lg:px-8 h-16">
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
          <LangSwitcher />
          
          <!-- CORRECTION : Le composant s'appelle UDropdown -->
          <UDropdownMenu :items="itemsMenuProfil">
            <UButton color="white" variant="ghost" class="flex items-center gap-2">
              <!-- CORRECTION : On utilise la donnée calculée pour l'avatar -->
              <UAvatar :alt="userFirstName.charAt(0)" size="sm" />
              <!-- CORRECTION : On affiche le nom complet de l'utilisateur -->
              <span class="hidden sm:block font-medium">{{ userFullName }}</span>
            </UButton>
          </UDropdownMenu>
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
    <!-- <USlideover v-model="isMobileMenuOpen">
      <div class="p-4 flex-1">
        <div class="flex items-center gap-2 mb-8">
          <UIcon name="i-heroicons-shield-check-solid" class="h-8 w-8 text-green-500" />
          <span class="font-bold text-xl">Valor-Chain</span>
        </div>
        <!-- CORRECTION : Le composant s'appelle UVerticalNavigation --
        <UNavigationMenu :links="navigationLinks" @click="isMobileMenuOpen = false" />
      </div>
    </USlideover> -->
    <USlideover v-model:open="isProfileEditorOpen" title="First slideover" :ui="{ footer: 'justify-end' }">      
      <template #header>
        <div class="flex items-center justify">
          <h2 class="text-xl font-semibold">Modifier mon profil</h2>          
        </div>
      </template>

      <template #body>
        <ProfileEditor @close="isProfileEditorOpen = false" />
      </template>
    </USlideover>

  </div>
</template>
