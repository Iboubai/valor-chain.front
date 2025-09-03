<!-- pages/inscription.vue -->
<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { FormError } from '#ui/types'

// --- CONFIGURATION ---
definePageMeta({
    auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' },
    layout: 'auth' // Utilise un layout spécifique sans header/footer
  })
// --- ÉTAT DU FORMULAIRE ---
const currentStep = ref(1)
const totalSteps = 3 // Nous aurons 3 étapes : Email/Tel, Infos Perso, Chaîne de valeur

const formData = reactive({
  email: 'sdfsd@gmail.com',
  phoneNumber: '629817971',
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: '',
  birthDate: '',
  region: null,
  prefecture: null,
  subPrefecture: null,
  valueChainLink: [] as string[]
})

// états pour afficher/masquer
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const loading = ref(false)
const apiError = ref<string | null>(null)
const url = useRuntimeConfig().public.apiBase;

const regionsRes = await $fetch(`${url}/api/locations/regions/getall`, { method: 'GET' })
const regions = ref(regionsRes.data)

const prefectures = ref([])
const subPrefectures = ref([])
const valueChainOptionsRes = await $fetch(`${url}/api/users/getalluserprofils`, { method: 'GET' })
const valueChainOptions = ref(valueChainOptionsRes.data)

// --- LOGIQUE DE NAVIGATION ---
const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// --- VALIDATION ET LOGIQUE MÉTIER ---

// Surveille le changement de région pour charger les préfectures
watch(() => formData.region, async (newRegionId) => {
  formData.prefecture = null
  formData.subPrefecture = null
  if (!newRegionId) {
    prefectures.value = []
    return
  }
  
  // Remplacer par votre appel API réel
  const prefectureRes = await $fetch(`${url}/api/locations/prefectures/${newRegionId}`)
  prefectures.value = prefectureRes.data
})

// Surveille le changement de préfecture pour charger les sous-préfectures
watch(() => formData.prefecture, async (newPrefectureId) => {
    formData.subPrefecture = null
    if (!newPrefectureId) {
        subPrefectures.value = []
        return
    }
    const sousPrefectureRes = await $fetch(`${url}/api/locations/sous-prefectures/${newPrefectureId}`)
    subPrefectures.value = sousPrefectureRes.data    
})


const handleStep1 = async () => {
  loading.value = true
  apiError.value = null
  try {
    if (formData.password !== formData.confirmPassword) {
      apiError.value = "Les deux mot de passe sont pas identique."
      return
    }


    if (!formData.email || !formData.phoneNumber) {
      apiError.value = "Veuillez remplir tous les champs d'information."
      return
    }
    // Vérification de l'email
    const emailResponse = await $fetch(`${url}/api/users/check-email`, { method: 'POST', body: { email: formData.email } })
    const emailExists = emailResponse.data;
    if (emailExists) {
      apiError.value = "Cette adresse e-mail est déjà utilisée."
      return
    }

    // Vérification du téléphoneNumber
    const phoneResponse = await $fetch(`${url}/api/users/check-phone`, { method: 'POST', body: { phoneNumber: formData.phoneNumber } })
    const phoneExists = phoneResponse.data;
    if (phoneExists) {
      apiError.value = "Ce numéro de téléphone est déjà utilisé."
      return
    }

    // Si tout est bon, on passe à l'étape suivante
    nextStep()
  } catch (err: any) {
    // Le bloc CATCH est le bon endroit pour gérer les erreurs de validation de l'API (statut 400)
    
    // On vérifie si l'erreur vient de l'API et contient notre structure d'erreurs
    if (err.data && err.data.errors) {
      // On prend le premier message d'erreur du tableau
      const errorMessages = Object.values(err.data.errors).flat();
      apiError.value = errorMessages.join(' ');
    } else {
      // Erreur générique si la structure est inattendue
      apiError.value = "Échec de la communication avec le serveur.";
    }
  } finally {
    loading.value = false
  }
}

const handleStep2 = () => {
  // Simple validation avant de passer à l'étape suivante
  if (!formData.firstName || !formData.lastName || !formData.birthDate || !formData.subPrefecture) {
      apiError.value = "Veuillez remplir tous les champs d'information."
      return
  }
  apiError.value = null
  nextStep()
}

const submitRegistration = async () => {
  console.log('Données du formulaire avant soumission :', formData) 
  loading.value = true
  apiError.value = null
  try {
    // Appel final pour créer l'utilisateur avec toutes les données
    console.log('Données à envoyer :', formData)
    const result = await $fetch(`${url}/api/auth/createuser`, {
      method: 'POST',
      body: formData
    })
    console.log('Inscription réussie !', result)
    // Rediriger vers la page de connexion ou directement connecter l'utilisateur
    const router = useRouter()
    router.push('/connexion?status=registered')

  } catch (err) {
    apiError.value = "Une erreur finale est survenue lors de l'inscription."
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Calcule la progression pour la barre de progression
const progressValue = computed(() => (currentStep.value / totalSteps) * 100)

</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
    <div class="absolute top-4 right-4">
      <LangSwitcher />
    </div>

    <UCard class="w-full max-w-2xl">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold">Créer votre compte</h1>
          <span class="text-sm text-gray-500">Étape {{ currentStep }} sur {{ totalSteps }}</span>
        </div>
        <UProgress :value="progressValue" class="mt-2" />
      </template>

      <!-- Contenu de l'étape actuelle -->
      <div class="min-h-[350px]">
        <!-- ÉTAPE 1: Email et Téléphone -->
        <div v-if="currentStep === 1">
          <h2 class="text-2xl font-bold mb-4">Informations de contact</h2>
          <UForm :state="formData" class="space-y-4">
            <UFormField label="Adresse e-mail" name="email">
              <UInput v-model="formData.email" type="email" placeholder="vous@exemple.com" icon="i-heroicons-envelope" class="w-full" />
            </UFormField>
            <UFormField label="Numéro de téléphone" name="phoneNumber">
              <UInput v-model="formData.phoneNumber" type="tel" placeholder="+224 620 00 00 00" icon="i-heroicons-phone" />
            </UFormField>
            <UFormField label="Mot de passe" name="password">
              <UInput v-model="formData.password" :type="showPassword ? 'text' : 'password'" placeholder="********" icon="i-heroicons-lock-closed" class="w-full" />
              <button type="button"
                class="absolute right-2 top-2 text-gray-500"
                @click="showPassword = !showPassword">
                <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" />
              </button>
            </UFormField>
            <UFormField label="Confirmation mot de passe" name="confirmPassword">
              <UInput v-model="formData.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" placeholder="Confirmez le mot de passe" icon="i-heroicons-lock-closed" class="w-full" />
              <button type="button"
                class="absolute right-2 top-2 text-gray-500"
                @click="showConfirmPassword = !showConfirmPassword">
                <UIcon :name="showConfirmPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" />
              </button>
            </UFormField>
          </UForm>
        </div>

        <!-- ÉTAPE 2: Informations Personnelles -->
        <div v-if="currentStep === 2">
          <h2 class="text-2xl font-bold mb-4">Informations personnelles</h2>
          <UForm :state="formData" class="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Prénom" name="firstName" class="col-span-2 md:col-span-1">
              <UInput v-model="formData.firstName" class="w-full" />
            </UFormField>
            <UFormField label="Nom" name="lastName" class="col-span-2 md:col-span-1">
              <UInput v-model="formData.lastName" class="w-full" />
            </UFormField>
            <UFormField label="Date de naissance" name="birthDate" class="col-span-2">
              <UInput v-model="formData.birthDate" type="date" />
            </UFormField>
            <UFormField label="Région" name="region">
              <USelectMenu v-model="formData.region" :items="regions" label-key="name" value-key="id" placeholder="Sélectionner une région" class="w-full" />
            </UFormField>
            <UFormField label="Préfecture" name="prefecture">
              <USelectMenu v-model="formData.prefecture" :items="prefectures"  label-key="name" value-key="id"  placeholder="Sélectionner une préfecture" :disabled="!formData.region" class="w-full" />
            </UFormField>
            <UFormField label="Sous-préfecture" name="subPrefecture" class="col-span-2">
              <USelectMenu v-model="formData.subPrefecture" :items="subPrefectures"  label-key="name" value-key="id"  placeholder="Sélectionner une sous-préfecture" :disabled="!formData.prefecture" class="w-full" />
            </UFormField>
          </UForm>
        </div>

        <!-- ÉTAPE 3: Chaîne de valeur -->
        <div v-if="currentStep === 3">
          <h2 class="text-2xl font-bold mb-4">Dans quel maillon de la chaîne de valeur vous situez-vous ?</h2>
          <UCheckboxGroup v-model="formData.valueChainLink" :items="valueChainOptions" class="space-y-2" />
        </div>
      </div>

      <template #footer>
        <!-- Affichage des erreurs de l'API -->
        <div v-if="apiError" class="mb-4 text-center text-sm text-red-500">
          <p>{{ apiError }}</p>
        </div>

        <!-- Boutons de navigation -->
        <div class="flex justify-between items-center">
          <UButton
            v-if="currentStep > 1"
            icon="i-heroicons-arrow-left"
            variant="outline"
            @click="prevStep"
          >
            Précédent
          </UButton>
          <div v-else></div> <!-- Espaceur pour garder le bouton "Suivant" à droite -->

          <UButton
            v-if="currentStep === 1"
            :loading="loading"
            trailing-icon="i-heroicons-arrow-right"
            @click="handleStep1"
          >
            Suivant
          </UButton>
          <UButton
            v-if="currentStep === 2"
            trailing-icon="i-heroicons-arrow-right"
            @click="handleStep2"
          >
            Suivant
          </UButton>
          <UButton
            v-if="currentStep === totalSteps"
            :loading="loading"
            icon="i-heroicons-check-circle"
            @click="submitRegistration"
          >
            Terminer l'inscription
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>