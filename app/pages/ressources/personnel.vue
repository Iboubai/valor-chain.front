<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-4">Gestion du Personnel</h2>

    <!-- Formulaire d’ajout -->
    <div class="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6">
      <UInput v-model="newPers.matricule" placeholder="Matricule" />
      <UInput v-model="newPers.nomComplet" placeholder="Nom complet" />
      <UInput v-model="newPers.poste" placeholder="Poste" />
      <USelectMenu v-model="newPers.service" :items="services" placeholder="Service" />
      <USelectMenu v-model="newPers.statut" :items="statuts" placeholder="Statut" />
      <UInput v-model="newPers.contact" placeholder="Contact" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
      <UInput v-model="newPers.email" placeholder="Email" />
      <UInput v-model="newPers.dateEmbauche" type="date" />
      <UInput v-model.number="newPers.salaire" type="number" placeholder="Salaire" />
    </div>

    <div class="flex gap-2 mb-6">
      <UButton @click="addPers">Ajouter</UButton>
      <UButton variant="outline" color="gray" @click="fetchPersonnel">Actualiser</UButton>
    </div>

    <!-- Statistiques -->
    <div class="flex flex-wrap gap-6 mb-6 text-sm text-gray-600">
      <div>Total : <strong>{{ totalPersonnel }}</strong></div>
      <div>Actifs : <strong>{{ actifs.length }}</strong></div>
      <div>En congé : <strong>{{ enConge.length }}</strong></div>
    </div>

    <!-- Tableau du personnel -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm bg-white border rounded">
        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="p-2">Matricule</th>
            <th class="p-2">Nom complet</th>
            <th class="p-2">Poste</th>
            <th class="p-2">Service</th>
            <th class="p-2">Statut</th>
            <th class="p-2">Contact</th>
            <th class="p-2">Date embauche</th>
            <th class="p-2">Salaire</th>
            <th class="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pers in personnels" :key="pers.id" class="border-t hover:bg-gray-50">
            <td class="p-2">{{ pers.matricule }}</td>
            <td class="p-2">{{ pers.nomComplet }}</td>
            <td class="p-2">{{ pers.poste }}</td>
            <td class="p-2">{{ pers.service }}</td>
            <td class="p-2" :class="statutClass(pers.statut)">{{ pers.statut }}</td>
            <td class="p-2">{{ pers.contact }}</td>
            <td class="p-2">{{ pers.dateEmbauche }}</td>
            <td class="p-2">{{ pers.salaire ? pers.salaire.toLocaleString() + ' GNF' : '-' }}</td>
            <td class="p-2 flex gap-2">
              <UButton size="xs" color="blue" variant="ghost" @click="editPers(pers)">Éditer</UButton>
              <UButton size="xs" color="red" variant="ghost" @click="removePers(pers.id)">Suppr</UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal d’édition -->
    <UModal v-model="isEditOpen">
      <div class="p-4 space-y-3">
        <h3 class="font-semibold text-lg mb-2">Modifier le personnel</h3>
        <UInput v-model="editItem.nomComplet" placeholder="Nom complet" />
        <USelectMenu v-model="editItem.statut" :items="statuts" placeholder="Statut" />
        <UInput v-model="editItem.poste" placeholder="Poste" />
        <div class="flex justify-end gap-2 mt-4">
          <UButton color="gray" variant="outline" @click="isEditOpen = false">Annuler</UButton>
          <UButton @click="saveEdit">Enregistrer</UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
    import { reactive, ref, onMounted } from 'vue'
    import { usePersonnel } from '@/composables/usePersonnel'
    import { useToast } from '#imports'

    const toast = useToast()
    const {
    personnels,
    fetchPersonnel,
    addPersonnel,
    updatePersonnel,
    deletePersonnel,
    totalPersonnel,
    actifs,
    enConge
    } = usePersonnel()

    const services = ['Production', 'Maintenance', 'Comptabilité', 'Ressources humaines', 'Sécurité']
    const statuts = ['Actif', 'En congé', 'Suspendu', 'Démissionné']

    const newPers = reactive({
    matricule: '',
    nomComplet: '',
    poste: '',
    service: '',
    contact: '',
    statut: 'Actif',
    dateEmbauche: new Date().toISOString().split('T')[0],
    salaire: 0
    })

    const isEditOpen = ref(false)
    const editItem = reactive({} as any)

    function statutClass(statut: string) {
    switch (statut) {
        case 'Actif': return 'text-green-600 font-semibold'
        case 'En congé': return 'text-yellow-600 font-semibold'
        case 'Suspendu': return 'text-orange-600 font-semibold'
        case 'Démissionné': return 'text-red-600 font-semibold'
    }
    }

    async function addPers() {
    if (!newPers.nomComplet || !newPers.poste) {
        toast.add({ title: 'Champs requis manquants', color: 'red' })
        return
    }
    await addPersonnel({ ...newPers })
    Object.assign(newPers, {
        matricule: '',
        nomComplet: '',
        poste: '',
        service: '',
        contact: '',
        salaire: 0
    })
    }

    function editPers(pers: any) {
    Object.assign(editItem, pers)
    isEditOpen.value = true
    }

    async function saveEdit() {
    await updatePersonnel(editItem)
    isEditOpen.value = false
    }

    async function removePers(id: number) {
    await deletePersonnel(id)
    }

    onMounted(fetchPersonnel)
</script>
