<!-- components/ProfileEditor.vue -->
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { Form } from '#ui/types'

// On définit les événements que ce composant peut émettre (ici, juste 'close')
const emit = defineEmits(['close'])

const { data: user, refresh } = useAuth() // `refresh` permet de recharger les données utilisateur
const form = ref<Form<any> | null>(null)
const loading = ref(false)
const toast = useToast()

// On crée une copie locale et réactive des données de l'utilisateur pour le formulaire.
// C'est une bonne pratique pour ne pas modifier directement l'objet `user` global.
const state = reactive({
  firstName: '',
  lastName: '',
  phoneNumber: ''
})

// Quand le composant est monté (et donc que `user` est disponible),
// on remplit notre formulaire avec les données actuelles.
onMounted(() => {
  if (user.value?.data) {
    state.firstName = user.value.data.firstName
    state.lastName = user.value.data.lastName
    state.phoneNumber = user.value.data.phoneNumber
  }
})

async function onSubmit() {
  if (!form.value) return
  
  // Valide le formulaire avant de soumettre
  await form.value.validate()

  loading.value = true
  try {
    // Appel à l'API pour mettre à jour l'utilisateur
    // Assurez-vous d'avoir un endpoint PATCH ou PUT pour cela.
    await $fetch(`/api/auth/user/${user.value?.data.id}`, {
      method: 'PATCH', // ou 'PUT'
      body: state
    })

    // Si la mise à jour réussit :
    toast.add({ title: 'Profil mis à jour avec succès !', color: 'green' })
    
    // On rafraîchit la session pour que toute l'application ait les nouvelles données
    await refresh()

    // On ferme le panneau
    emit('close')

  } catch (error) {
    toast.add({ title: 'Erreur lors de la mise à jour', description: 'Veuillez réessayer.', color: 'red' })
    console.error("Erreur de mise à jour du profil:", error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- Le UCard à l'intérieur du Slideover donne une belle structure -->
  <UCard class="flex flex-col flex-1" :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">Modifier mon profil</h2>
        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="$emit('close')" />
      </div>
    </template>

    <!-- Contenu principal du formulaire -->
    <UForm ref="form" :state="state" class="space-y-4 p-4" @submit="onSubmit">
      <UFormField label="Prénom" name="firstName" required>
        <UInput v-model="state.firstName" />
      </UFormField>

      <UFormField label="Nom" name="lastName" required>
        <UInput v-model="state.lastName" />
      </UFormField>

      <UFormField label="Numéro de téléphone" name="phoneNumber" required>
        <UInput v-model="state.phoneNumber" icon="i-heroicons-phone" />
      </UFormField>
      
      <!-- L'email est souvent non modifiable, on peut l'afficher en lecture seule -->
      <UFormField label="Adresse e-mail (non modifiable)" name="email">
        <UInput :model-value="user?.data?.email" disabled icon="i-heroicons-envelope" />
      </UFormField>
    </UForm>

    <template #footer>
      <div class="flex justify-end gap-4">
        <UButton variant="outline" @click="$emit('close')">Annuler</UButton>
        <UButton :loading="loading" @click="onSubmit">Enregistrer les modifications</UButton>
      </div>
    </template>
  </UCard>
</template>
