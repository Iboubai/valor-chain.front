<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="Nom de la bassin" name="name" required>
      <UInput 
        v-model="state.name" 
        placeholder="Ex: Bassin/étang d'éclosion" 
        autofocus 
        autocomplete="off" class="w-full"
      />
    </UFormField>
    
    <UFormField label="Description du bassin/étang" name="description">
      <UInput 
        v-model="state.description" 
        placeholder="Ex: Bassin/étang à temperature ambiante" 
        autocomplete="off" class="w-full"
      />
    </UFormField>

    <UFormField label="Effectif" name="effectif" required>
      <UInput v-model.number="state.effectif" type="number" step="1">
        <template #trailing>
          <span class="text-gray-500 dark:text-gray-400 text-xs">tête</span>
        </template>
      </UInput>
    </UFormField>
    
    <UFormField label="Surface" name="surface" required>
      <UInput v-model.number="state.surface" type="number" step="0.1">
        <template #trailing>
          <span class="text-gray-500 dark:text-gray-400 text-xs">m²</span>
        </template>
      </UInput>
    </UFormField>

    <UFormField label="Profondeur" name="profondeur" required>
      <UInput v-model.number="state.profondeur" type="number" step="0.1">
        <template #trailing>
          <span class="text-gray-500 dark:text-gray-400 text-xs">cm</span>
        </template>
      </UInput>
    </UFormField>

    <UFormField label="Type de bassin/étang" name="typeId" required>
      <!-- key pour forcer refresh quand state.typeId change -->
      <USelectMenu 
        :key="`type-${state.typeId ?? 'none'}`"
        v-model="state.typeId" 
        :items="bassinTypes" 
        label-key="name" 
        value-key="id" 
        placeholder="Sélectionner le type de bassin/étang" 
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
const bassinTypesRes = await get(`/api/exploitation/bassins/getallbassintypes`)
const bassinTypes = ref(bassinTypesRes.data || [])

const emit = defineEmits<{
  (e: 'save', payload: any): void
  (e: 'close'): void
}>()

const props = defineProps<{
  bassin?: {
    id: number
    name: string
    description?: string
    effectif?: number
    surface?: number
    profondeur?: number
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
  effectif: undefined as number | undefined,
  surface: undefined as number | undefined,
  profondeur: undefined as number | undefined,
  typeId: undefined as number | undefined,
  createdDate: undefined,
  statusId: undefined as number | undefined
})

watch(
  () => props.bassin,
  async (newBassin) => {
    // debug    
    if (newBassin) {
      state.id = newBassin.id
      state.name = newBassin.name
      state.description = newBassin.description
      state.effectif = newBassin.effectif
      state.surface = newBassin.surface
      state.profondeur = newBassin.profondeur
      state.typeId = newBassin.type.id
      //state.statusId = newBassin.statusId
      state.createdDate = newBassin.createdDate
      // attendre le DOM au cas où les selects ont besoin d'un nextTick      
      await nextTick()
    } else {
      state.id = undefined
      state.name = undefined
      state.description = undefined
      state.effectif = undefined
      state.surface = undefined
      state.profondeur = undefined
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
  effectif: z.number({ required_error: 'L\'effectif est requise.' }).positive(),
  surface: z.number({ required_error: 'La surface est requise.' }).positive(),
  profondeur: z.number({ required_error: 'La profondeur est requise.' }).positive(),
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
