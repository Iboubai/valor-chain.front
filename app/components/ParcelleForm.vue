<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="Nom de la parcelle" name="name" required>
      <UInput 
        v-model="state.name" 
        placeholder="Ex: Bande de maraichage" 
        autofocus 
        autocomplete="off" class="w-full"
      />
    </UFormField>
    
    <UFormField label="Description de la parcelle" name="description">
      <UInput 
        v-model="state.description" 
        placeholder="Ex: Endroit ensoleillé" 
        autocomplete="off" class="w-full"
      />
    </UFormField>

    <UFormField label="Superficie" name="superficie" required>
      <UInput v-model.number="state.superficie" type="number" step="0.1">
        <template #trailing>
          <span class="text-gray-500 dark:text-gray-400 text-xs">ha</span>
        </template>
      </UInput>
    </UFormField>

    <UFormField label="Type de sol" name="typeId" required>
      <!-- key pour forcer refresh quand state.typeId change -->
      <USelectMenu 
        :key="`type-${state.typeId ?? 'none'}`"
        v-model="state.typeId" 
        :items="parcelleTypes" 
        label-key="name" 
        value-key="id" 
        placeholder="Sélectionner le type de sol" 
        class="w-full" 
      />
    </UFormField>

    <div class="flex justify-end space-x-3 pt-4">
      <UButton type="button" color="gray" variant="ghost" @click="emitClose" :disabled="isLoading">
        Annuler
      </UButton>
      <UButton :loading="isLoading" @click="onSubmit">Enregistrer</UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { watch, reactive, ref, nextTick } from 'vue'
import type { FormSubmitEvent } from '#ui/types'

const { data: user } = useAuth()
const { get } = useApi()

// données pour selects
const parcelleTypesRes = await get(`/api/exploitation/parcelles/getallparcelletypes`)
const parcelleTypes = ref(parcelleTypesRes.data || [])

const emit = defineEmits<{
  (e: 'save', payload: any): void
  (e: 'close'): void
}>()

const props = defineProps<{
  parcelle?: {
    id: number
    name: string
    description?: string
    superficie?: number
    typeId?: number
    statusId?: number
    createdDate: undefined
  } | null
}>()

const state = reactive({
  id: undefined as number | undefined,
  userid: user.value?.data.id,
  name: undefined as string | undefined,
  description: undefined as string | undefined,
  superficie: undefined as number | undefined,
  typeId: undefined as number | undefined,
  createdDate: undefined,
  statusId: undefined as number | undefined
})

watch(
  () => props.parcelle,
  async (newParcelle) => {
    // debug    
    if (newParcelle) {
      state.id = newParcelle.id
      state.name = newParcelle.name
      state.description = newParcelle.description
      state.superficie = newParcelle.superficie
      state.typeId = newParcelle.typeId
      //state.statusId = newParcelle.statusId
      state.createdDate = newParcelle.createdDate
      // attendre le DOM au cas où les selects ont besoin d'un nextTick      
      await nextTick()
    } else {
      state.id = undefined
      state.name = undefined
      state.description = undefined
      state.superficie = undefined
      state.typeId = undefined
      state.statusId = 1
      state.createdDate = undefined
    }
  },
  { immediate: true }
)

// validation -> champs synchronisés avec state
const schema = z.object({
  name: z.string({ required_error: 'Le nom est requis.' }).min(3),
  description: z.string().optional(),
  superficie: z.number({ required_error: 'La superficie est requise.' }).positive(),
  typeId: z.number()
})

const isLoading = ref(false)

function emitClose() {
  emit('close')
}

async function onSubmit(event?: FormSubmitEvent) {
  // si event est un event natif, prévenir le comportement par défaut
  if (event && (event as any).preventDefault) (event as any).preventDefault()
  isLoading.value = true
  // debug pour vérifier que l'emit part bien
  emit('save', { ...state })
  isLoading.value = false
}
</script>
