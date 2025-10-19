<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-4">Gestion des stocks (Intrants)</h2>

    <!-- Formulaire d’ajout -->
    <div class="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6">
      <UInput v-model="newItem.name" placeholder="Nom de l'intrant" />
      <USelectMenu v-model="newItem.category" :items="categories" placeholder="Catégorie" />
      <UInput v-model="newItem.unit" placeholder="Unité (kg, L, sac...)" />
      <UInput v-model.number="newItem.quantity" type="number" placeholder="Quantité" />
      <UInput v-model.number="newItem.threshold" type="number" placeholder="Seuil d'alerte" />
      <UInput v-model="newItem.dateEntry" type="date" />
    </div>

    <div class="flex gap-2 mb-6">
      <UButton @click="addStockItem">Ajouter</UButton>
      <UButton variant="outline" color="gray" @click="fetchStocks">Actualiser</UButton>
    </div>

    <!-- Statistiques -->
    <div class="mb-6 flex flex-wrap gap-6 text-sm text-gray-600">
      <div>Total d’intrants : <strong>{{ totalItems }}</strong></div>
      <div>Quantité totale : <strong>{{ totalQuantity }}</strong></div>
      <div v-if="lowStock.length" class="text-red-600">
        ⚠️ {{ lowStock.length }} articles sous le seuil
      </div>
    </div>

    <!-- Tableau -->
    <table class="w-full text-sm bg-white border rounded">
      <thead class="bg-gray-100 text-left">
        <tr>
          <th class="p-2">Nom</th>
          <th class="p-2">Catégorie</th>
          <th class="p-2">Quantité</th>
          <th class="p-2">Unité</th>
          <th class="p-2">Seuil</th>
          <th class="p-2">Date d’entrée</th>
          <th class="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id" class="border-t hover:bg-gray-50">
          <td class="p-2">{{ item.name }}</td>
          <td class="p-2">{{ item.category }}</td>
          <td class="p-2">{{ item.quantity }}</td>
          <td class="p-2">{{ item.unit }}</td>
          <td class="p-2" :class="item.quantity <= item.threshold ? 'text-red-600' : ''">{{ item.threshold }}</td>
          <td class="p-2">{{ item.dateEntry }}</td>
          <td class="p-2">
            <UButton size="xs" color="red" variant="ghost" @click="removeItem(item.id)">Suppr</UButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
    import { reactive, onMounted } from 'vue'
    import { useStock } from '@/composables/useStock'
    import { useToast } from '#imports'

    const { items, fetchStocks, addStock, deleteStock, totalItems, totalQuantity, lowStock } = useStock()
    const toast = useToast()

    const newItem = reactive({
        name: '',
        category: '',
        unit: '',
        quantity: 0,
        threshold: 0,
        dateEntry: new Date().toISOString().split('T')[0],
    })

    const categories = ['Engrais', 'Semences', 'Produits phytosanitaires', 'Matériel', 'Autres']

    async function addStockItem() {
    if (!newItem.name || !newItem.category) {
        toast.add({ title: 'Veuillez renseigner les champs obligatoires', color: 'red' })
        return
    }
    await addStock({ ...newItem })
    Object.assign(newItem, { name: '', category: '', unit: '', quantity: 0, threshold: 0, dateEntry: new Date().toISOString().split('T')[0] })
    }

    async function removeItem(id: number) {
    await deleteStock(id)
    }

    onMounted(fetchStocks)
</script>
