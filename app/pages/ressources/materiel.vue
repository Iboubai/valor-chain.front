<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-4">Gestion des Matériels & Équipements</h2>

    <!-- Formulaire d’ajout -->
    <div class="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6">
      <UInput v-model="newMat.nom" placeholder="Nom du matériel" />
      <USelectMenu v-model="newMat.type" :items="types" placeholder="Type" />
      <USelectMenu v-model="newMat.categorie" :items="categories" placeholder="Catégorie" />
      <UInput v-model.number="newMat.quantite" type="number" placeholder="Quantité" />
      <USelectMenu v-model="newMat.etat" :items="etats" placeholder="État" />
      <UInput v-model="newMat.localisation" placeholder="Localisation" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
      <UInput v-model="newMat.responsable" placeholder="Responsable" />
      <UInput v-model="newMat.dateAcquisition" type="date" />
      <UInput v-model="newMat.observations" placeholder="Observations" />
    </div>

    <div class="flex gap-2 mb-6">
      <UButton @click="addMat">Ajouter</UButton>
      <UButton variant="outline" color="gray" @click="fetchMateriels">Actualiser</UButton>
    </div>

    <!-- Statistiques -->
    <div class="flex flex-wrap gap-6 mb-6 text-sm text-gray-600">
      <div>Total équipements : <strong>{{ totalMateriels }}</strong></div>
      <div>Disponibles : <strong>{{ disponibles.length }}</strong></div>
      <div>En maintenance : <strong>{{ enMaintenance.length }}</strong></div>
    </div>

    <!-- Tableau -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm bg-white border rounded">
        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="p-2">Nom</th>
            <th class="p-2">Type</th>
            <th class="p-2">Catégorie</th>
            <th class="p-2">Quantité</th>
            <th class="p-2">État</th>
            <th class="p-2">Localisation</th>
            <th class="p-2">Responsable</th>
            <th class="p-2">Date acquisition</th>
            <th class="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="mat in materiels" :key="mat.id" class="border-t hover:bg-gray-50">
            <td class="p-2">{{ mat.nom }}</td>
            <td class="p-2">{{ mat.type }}</td>
            <td class="p-2">{{ mat.categorie }}</td>
            <td class="p-2">{{ mat.quantite }}</td>
            <td class="p-2" :class="etatClass(mat.etat)">{{ mat.etat }}</td>
            <td class="p-2">{{ mat.localisation }}</td>
            <td class="p-2">{{ mat.responsable }}</td>
            <td class="p-2">{{ mat.dateAcquisition }}</td>
            <td class="p-2 flex gap-2">
              <UButton size="xs" color="blue" variant="ghost" @click="editMat(mat)">Éditer</UButton>
              <UButton size="xs" color="red" variant="ghost" @click="removeMat(mat.id)">Suppr</UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal d’édition -->
    <UModal v-model="isEditOpen">
      <div class="p-4 space-y-3">
        <h3 class="font-semibold text-lg mb-2">Modifier le matériel</h3>
        <UInput v-model="editItem.nom" placeholder="Nom" />
        <USelectMenu v-model="editItem.etat" :items="etats" placeholder="État" />
        <UInput v-model="editItem.localisation" placeholder="Localisation" />
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
    import { useMateriel } from '@/composables/useMateriel'
    import { useToast } from '#imports'

    const toast = useToast()
    const {
        materiels,
        fetchMateriels,
        addMateriel,
        updateMateriel,
        deleteMateriel,
        totalMateriels,
        disponibles,
        enMaintenance
    } = useMateriel()

    const types = ['Tracteur', 'Outil', 'Véhicule', 'Pompe', 'Autre']
    const categories = ['Mécanique', 'Électrique', 'Transport', 'Manuel']
    const etats = ['Disponible', 'En panne', 'En maintenance', 'Utilisé']

    const newMat = reactive({
    nom: '',
    type: '',
    categorie: '',
    quantite: 1,
    etat: 'Disponible',
    localisation: '',
    dateAcquisition: new Date().toISOString().split('T')[0],
    responsable: '',
    observations: ''
    })

    const isEditOpen = ref(false)
    const editItem = reactive({} as any)

    function etatClass(etat: string) {
    switch (etat) {
        case 'Disponible': return 'text-green-600 font-semibold'
        case 'En panne': return 'text-red-600 font-semibold'
        case 'En maintenance': return 'text-yellow-600 font-semibold'
        case 'Utilisé': return 'text-blue-600 font-semibold'
    }
    }

    async function addMat() {
    if (!newMat.nom || !newMat.type) {
        toast.add({ title: 'Veuillez renseigner les champs obligatoires', color: 'red' })
        return
    }
    await addMateriel({ ...newMat })
    Object.assign(newMat, { nom: '', type: '', categorie: '', quantite: 1, localisation: '', responsable: '' })
    }

    function editMat(mat: any) {
    Object.assign(editItem, mat)
    isEditOpen.value = true
    }

    async function saveEdit() {
    await updateMateriel(editItem)
    isEditOpen.value = false
    }

    async function removeMat(id: number) {
    await deleteMateriel(id)
    }

    onMounted(fetchMateriels)
</script>
