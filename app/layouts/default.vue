<!-- layouts/default.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NavigationMenuItem } from '#ui/types'
import type { DropdownMenuItem } from '@nuxt/ui'

const { data: user, signOut } = useAuth()

console.log("Données utilisateur du backend:", user)

// 3. GESTION DU MENU MOBILE
const isMobileMenuOpen = ref(false)

// 4. EXTRACTION DES DONNÉES UTILISATEUR POUR LE TEMPLATE
// On utilise des computed pour rendre le template plus propre et éviter les erreurs si user est null
const userFirstName = computed(() => user.value?.data?.firstName || '')
const userFullName = computed(() => `${user.value?.data?.firstName || ''} ${user.value?.data?.lastName || ''}`.trim())

//{ label: 'Tableau de bord', icon: 'i-heroicons-squares-2x2', to: '/' }
const itemsVerticalNav = ref<NavigationMenuItem[]>([
  {
    label: 'Tableau de bord',
    icon: 'i-heroicons-squares-2x2',
    to: '/'
  },
  {
    label: 'Mes Activités',
    icon: 'i-heroicons-bolt',
    children: [
      { label: 'Mon exploitation', icon: 'i-heroicons-cpu-chip', to: '/activities/production' }
    ]
  },
  {
    label: 'Contact',
    icon: 'i-heroicons-lifebuoy',
    to: '/contact'
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
