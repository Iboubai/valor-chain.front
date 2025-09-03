<template>
  <div class="auth-container">    
    <div class="absolute top-4 right-4">
      <LangSwitcher />
    </div>
    <!-- ===================================================== -->
    <!-- ==      INTERFACE N°1 : MODERNE ET CENTRÉE         == -->
    <!-- ===================================================== -->
    <UCard v-if="activeInterface === 'centered'" class="max-w-sm w-full mx-auto shadow-xl">
      <template #header>        
        <div class="text-center">
          <h1 class="text-2xl font-bold">{{ $t('login_title') }}</h1>
          <p class="text-gray-500 dark:text-gray-400">Bienvenue sur Valor-Chain</p>
        </div>
      </template>

      <UForm :state="credentials" class="space-y-4" @submit="handleLogin">
        <UFormField label="Email" name="email">
          <UInput v-model="credentials.email" type="email" placeholder="vous@exemple.com" :icon="emailIcon" size="xl" />
        </UFormField>

        <UFormField label="Mot de passe" name="password">
          <UInput v-model="credentials.password" type="password" placeholder="••••••••" :icon="passwordIcon" size="xl" />
        </UFormField>

        <div class="text-right">
          <UButton variant="link" :padded="false">Mot de passe oublié ?</UButton>
        </div>

        <UButton type="submit" :loading="loading" :label="$t('login_button')" :color="primaryColor" block size="xl" />
      </UForm>

      <template #footer>
        <p v-if="error" class="text-red-500 text-center text-sm mb-4">{{ error }}</p>
        <p class="text-sm text-center text-gray-500 dark:text-gray-400">
          Pas encore de compte ? <UButton variant="link" :padded="false" to="/inscription">Inscrivez-vous</UButton>
        </p>
      </template>
    </UCard>

    <!-- ===================================================== -->
    <!-- ==   INTERFACE N°2 : CLASSIQUE AVEC PANNEAU LATÉRAL  == -->
    <!-- ===================================================== -->
    <div v-if="activeInterface === 'split'" class="w-full max-w-4xl flex rounded-lg shadow-2xl overflow-hidden bg-white dark:bg-gray-900">
      <!-- Panneau de gauche (Image/Branding) -->       
      <div class="hidden md:block md:w-1/2 bg-gray-100 dark:bg-gray-800 p-12 flex-col justify-center items-center text-center">
        <!-- Vous pouvez mettre une image ici -->
        <!-- <img src="/assets/images/image_connexion.jpg" alt="Branding" class="w-full h-full object-cover"> -->
        <div class="flex flex-col justify-center h-full">
            <UIcon name="i-heroicons-shield-check" class="text-6xl text-green-500 mx-auto" />
            <h2 class="mt-6 text-2xl font-bold text-gray-900 dark:text-white">Sécurisé et Fiable</h2>
            <p class="mt-2 text-gray-600 dark:text-gray-300">Rejoignez notre écosystème de confiance et valorisez vos actifs en toute sécurité.</p>
        </div>
      </div>

      <!-- Panneau de droite (Formulaire) -->
      <div class="w-full md:w-1/2 p-8 md:p-12">
        <h1 class="text-2xl font-bold mb-2">{{ $t('login_title') }}</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-6">Connectez-vous à votre compte.</p>
        
        <UForm :state="credentials" class="space-y-4" @submit="handleLogin">
          <UFormField label="Email" name="email">
            <UInput v-model="credentials.email" placeholder="vous@exemple.com" :icon="emailIcon" class="w-full" />
          </UFormField>

          <UFormField label="Mot de passe" name="password" >
            <UInput v-model="credentials.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" :icon="passwordIcon" class="w-full" />
              <button type="button"
                class="absolute right-2 top-2 text-gray-500"
                @click="showPassword = !showPassword">
                <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" />
              </button>
            </UFormField>

          <UButton type="submit" :loading="loading" :label="$t('login_button')" :color="primaryColor" block />
        </UForm>

        <p v-if="error" class="text-red-500 text-center text-sm mt-4">{{ error }}</p>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Pas encore de compte ? <UButton variant="link" to="/inscription">Créez-en un</UButton>
          </p>
        </div>
      </div>
    </div>

    <!-- ===================================================== -->
    <!-- ==      INTERFACE N°3 : SOCIAL ET INTÉGRÉ          == -->
    <!-- ===================================================== -->
    <UCard v-if="activeInterface === 'social'" class="max-w-md w-full mx-auto shadow-xl">
       <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold">Connexion</h1>
        </div>
      </template>

      <div class="space-y-3">
        <UButton color="white" block label="Continuer avec Google" icon="i-logos-google-icon" />
        <UButton color="white" block label="Continuer avec GitHub" icon="i-logos-github-icon" />
      </div>

      <USeparator label="OU" class="my-6" />

      <UForm :state="credentials" class="space-y-4" @submit="handleLogin">
        <UFormField label="Email" name="email">
          <UInput v-model="credentials.email" type="email" placeholder="vous@exemple.com" />
        </UFormField>

        <UFormField label="Mot de passe" name="password">
          <UInput v-model="credentials.password" type="password" placeholder="••••••••" />
        </UFormField>

        <UButton type="submit" :loading="loading" label="Se connecter avec l'email" :color="primaryColor" block />
      </UForm>
      
      <p v-if="error" class="text-red-500 text-center text-sm mt-4">{{ error }}</p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '#imports'

// --- CONFIGURATION DE L'INTERFACE ---
// Changez cette valeur pour basculer entre les designs : 'centered', 'split', 'social'
const activeInterface = ref<'centered' | 'split' | 'social'>('split')
// ------------------------------------

const { signIn } = useAuth()
const { t } = useI18n()

definePageMeta({
  auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' },
  layout: 'auth' // Utilise un layout spécifique sans header/footer
})

const credentials = ref({ email: 'doumbouyaibrahima@gmail.com', password: '89Mamankoul$$' })
const error = ref<string | null>(null)
const loading = ref(false)

const showPassword = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = null
  try {
    // La logique de connexion reste la même, elle est indépendante de l'interface
    await signIn(credentials.value, { callbackUrl: '/' })
  } catch (e) {
    error.value = "Échec de l'authentification. Vérifiez vos identifiants."
    console.error(e)
  } finally {
    loading.value = false
  }
}

// Propriétés calculées pour les icônes et les couleurs (facilite la maintenance)
const emailIcon = computed(() => 'i-heroicons-envelope')
const passwordIcon = computed(() => 'i-heroicons-lock-closed')
const primaryColor = 'green' // Correspond à votre configuration Nuxt UI

</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f3f4f6; /* bg-gray-100 */
}

.dark .auth-container {
  background-color: #111827; /* dark:bg-gray-900 */
}
</style>
