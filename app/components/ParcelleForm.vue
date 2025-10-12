<template>
  <div class="flex h-full">
    <!-- Sidebar -->
    <aside class="w-56 border-r p-4 bg-white">
      <h4 class="text-lg font-semibold mb-4">Sections</h4>
      <nav class="flex flex-col gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="currentTab = tab.key"
          :class="[
            'text-left px-3 py-2 rounded-lg transition',
            currentTab === tab.key ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'
          ]"
        >
          <span class="block">{{ tab.label }}</span>
          <small v-if="tab.hint" class="text-xs text-gray-400">{{ tab.hint }}</small>
        </button>
      </nav>

      <div class="mt-6">
        <p class="text-xs text-gray-500">Statut courant :</p>
        <div class="mt-2 flex items-center gap-2">
          <span
            class="px-2 py-1 rounded-full text-xs font-semibold shadow-sm"
            :class="{
              'bg-green-100 text-green-700': state.status?.name === 'Disponible',
              'bg-yellow-100 text-yellow-700': state.status?.name === 'En Culture',
              'bg-red-100 text-red-700': state.status?.name === 'En Jachère',
              'bg-gray-100 text-gray-700': !state.status?.name
            }"
          >
            {{ state.status?.name || 'Inconnu' }}
          </span>
          <UButton size="xs" variant="ghost" @click="emitClose">Fermer</UButton>
        </div>
      </div>
    </aside>

    <!-- Content -->
    <section class="flex-1 p-6 overflow-auto">
      <header class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">{{ state.id ? 'Modifier la parcelle' : 'Nouvelle parcelle' }}</h2>
        <div class="flex items-center gap-2">
          <UButton color="gray" variant="ghost" size="sm" @click="emitClose">Annuler</UButton>
          <UButton color="primary" size="sm" @click="onSubmit" :loading="isLoading">Enregistrer</UButton>
        </div>
      </header>

      <!-- Contenu dynamique -->
      <div>
        <div v-if="currentTab === 'general'">
          <UForm :schema="schema" :state="state" class="space-y-4">
            <UFormField label="Nom de la parcelle" name="name" required>
              <UInput v-model="state.name" placeholder="Ex: Bande de maraichage" class="w-full" />
            </UFormField>

            <UFormField label="Description" name="description">
              <UInput v-model="state.description" placeholder="Ex: Endroit ensoleillé" class="w-full" />
            </UFormField>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <UFormField label="Superficie (ha)" name="superficie" required>
                <UInput v-model.number="state.superficie" type="number" step="0.1" />
              </UFormField>

              <UFormField label="Type de sol" name="typeId" required>
                <USelectMenu
                  v-model="state.typeId"
                  :items="parcelleTypes"
                  label-key="name"
                  value-key="id"
                  placeholder="Sélectionner le type de sol"
                />
              </UFormField>

              <UFormField label="Date création" name="createdDate">
                <UInput v-model="state.createdDate" type="date" />
              </UFormField>
            </div>
          </UForm>
        </div>

        <!-- Spéculations (Kanban) -->
        <div v-if="currentTab === 'speculations'">
          <BassinBoard
            :items="speculations"
            @update:items="val => (speculations = val)"
            @add="openSpeculationForm"
          />
        </div>

        <!-- Gantt Avancé -->
        <div v-if="currentTab === 'calendar'">
          <BassinGantt
            :tasks="tasks"
            @update:tasks="val => (tasks = val)"
            @import-standard="autoFillTasksFromStandard"
          />
        </div>

        <!-- Suivi des tâches (Drag & Drop) -->
        <div v-if="currentTab === 'tasks'">
          <BassinBoard
            type="tasks"
            :items="tasks"
            @update:items="val => (tasks = val)"
          />
        </div>

        <!-- Suivi budgétaire -->
        <div v-if="currentTab === 'budget'">
          <BassinStats
            :budgets="budgets"
            @update:budgets="val => (budgets = val)"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { z } from 'zod'

// Import des composants modulaires
import BassinBoard from './Exploitation/BassinBoard.vue'
import BassinGantt from './Exploitation/BassinGantt.vue'
import BassinStats from './Exploitation/BassinStats.vue'

// API et Auth
const { get } = useApi()
const { data: user } = useAuth()

const props = defineProps<{ parcelle?: any | null }>()
const emit = defineEmits<{ (e: 'save', payload: any): void; (e: 'close'): void }>()

const isLoading = ref(false)
const currentTab = ref('general')

const tabs = [
  { key: 'general', label: 'Informations générales', hint: 'Nom, type, superficie' },
  { key: 'speculations', label: 'Spéculations', hint: 'Drag & Drop, Kanban' },
  { key: 'calendar', label: 'Calendrier Gantt', hint: 'Planification visuelle' },
  { key: 'tasks', label: 'Tâches', hint: 'Glisser / déposer' },
  { key: 'budget', label: 'Statistiques', hint: 'Graphiques et analyse' }
]

// Types & données
const parcelleTypesRes = await get('/api/exploitation/parcelles/getallparcelletypes')
const parcelleTypes = ref(parcelleTypesRes.data || [])

const state = reactive({
  id: undefined,
  userid: user.value?.data.id,
  name: '',
  description: '',
  superficie: 0,
  typeId: undefined,
  createdDate: '',
  status: undefined
})

const speculations = ref([])
const tasks = ref([])
const budgets = ref([])

// Validation
const schema = z.object({
  name: z.string().min(3, 'Nom requis'),
  superficie: z.number().positive('Superficie > 0'),
  typeId: z.number()
})

// Watch pour hydrater le formulaire
watch(() => props.parcelle, (p) => {
  if (!p) return
  Object.assign(state, p)
  speculations.value = p.speculations || []
  tasks.value = p.tasks || []
  budgets.value = p.budgets || []
}, { immediate: true })

function emitClose() {
  emit('close')
}

function onSubmit() {
  isLoading.value = true
  const payload = { ...state, speculations: speculations.value, tasks: tasks.value, budgets: budgets.value }
  emit('save', payload)
  isLoading.value = false
}

function autoFillTasksFromStandard() {
  tasks.value.push({title: 'Préparation du sol', start: new Date(), end: new Date(Date.now() + 7 * 86400000) })
}
</script>

<style scoped>
aside {
  background: #fff;
}
</style>
