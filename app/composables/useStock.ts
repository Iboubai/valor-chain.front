// composables/useStock.ts
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'
import { useToast } from '#imports'

export interface StockItem {
  id?: number
  name: string
  category: string
  unit: string
  quantity: number
  threshold: number
  dateEntry: string
  supplier?: string
  parcelleId?: number
}

export function useStock() {
  const items = ref<StockItem[]>([])
  const { get, postAutorized } = useApi()  
  const { token } = useAuth()
  const toast = useToast()

  const totalItems = computed(() => items.value.length)
  const totalQuantity = computed(() =>
    items.value.reduce((sum, it) => sum + it.quantity, 0)
  )

  // Charger les stocks depuis l’API
  async function fetchStocks() {
    try {
      const res = await get('/api/stock/all')
      items.value = res.data || []
    } catch (e) {
      console.error(e)
      toast.add({ title: 'Erreur chargement stock', color: 'red' })
    }
  }

  // Ajouter un intrant au stock
  async function addStock(newItem: StockItem) {
    try {
      //const res = await postAutorized('/api/stock/create', newItem, token.value)
      //items.value.push(res.data || newItem)
      items.value.push(newItem)
      toast.add({ title: 'Intrant ajouté au stock', color: 'green' })
    } catch (e) {
      console.error(e)
      toast.add({ title: 'Erreur ajout stock', color: 'red' })
    }
  }

  // Retirer ou modifier un élément du stock
  async function updateStock(item: StockItem) {
    try {
      //await postAutorized(`/api/stock/update/${item.id}`, item, token.value)
      const index = items.value.findIndex(i => i.id === item.id)
      if (index !== -1) items.value[index] = item
      toast.add({ title: 'Stock mis à jour', color: 'green' })
    } catch (e) {
      toast.add({ title: 'Erreur mise à jour stock', color: 'red' })
    }
  }

  async function deleteStock(id: number) {
    try {
      //await postAutorized(`/api/stock/delete/${id}`, null, token.value)
      const index = items.value.findIndex(i => i.id === id)
      if (index !== -1) items.value.splice(index, 1)
      toast.add({ title: 'Intrant supprimé', color: 'green' })
    } catch (e) {
      toast.add({ title: 'Erreur suppression', color: 'red' })
    }
  }

  const lowStock = computed(() =>
    items.value.filter(i => i.quantity <= i.threshold)
  )

  return {
    items,
    totalItems,
    totalQuantity,
    lowStock,
    fetchStocks,
    addStock,
    updateStock,
    deleteStock
  }
}
