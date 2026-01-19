// composables/useMateriel.ts
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'
import { useToast } from '#imports'

export interface Materiel {
  id?: number
  nom: string
  type: string
  categorie: string
  quantite: number
  etat: 'Disponible' | 'En panne' | 'En maintenance' | 'Utilisé'
  localisation: string
  dateAcquisition: string
  derniereMaintenance?: string
  prochaineMaintenance?: string
  responsable?: string
  observations?: string
}

export function useMateriel() {
  const materiels = ref<Materiel[]>([])
  const { get, postAutorized } = useApi()
  const { token } = useAuth()
  const toast = useToast()

  const totalMateriels = computed(() => materiels.value.length)
  const disponibles = computed(() => materiels.value.filter(m => m.etat === 'Disponible'))
  const enMaintenance = computed(() => materiels.value.filter(m => m.etat === 'En maintenance'))

  // Récupération
  async function fetchMateriels() {
    try {
      const res = await get('/api/materiel/all')
      materiels.value = res.data || []
    } catch (e) {
      console.error(e)
      toast.add({ title: 'Erreur chargement matériels', color: 'red' })
    }
  }

  // Ajout
  async function addMateriel(newMat: Materiel) {
    try {
      //const res = await postAutorized('/api/materiel/create', newMat, token.value)
      //materiels.value.push(res.data || newMat)
      materiels.value.push(newMat)
      toast.add({ title: 'Matériel ajouté', color: 'green' })
    } catch (e) {
      toast.add({ title: 'Erreur ajout matériel', color: 'red' })
    }
  }

  // Mise à jour
  async function updateMateriel(mat: Materiel) {
    try {
      //await postAutorized(`/api/materiel/update/${mat.id}`, mat, token.value)
      const i = materiels.value.findIndex(m => m.id === mat.id)
      if (i !== -1) materiels.value[i] = mat
      toast.add({ title: 'Matériel mis à jour', color: 'green' })
    } catch (e) {
      toast.add({ title: 'Erreur mise à jour', color: 'red' })
    }
  }

  // Suppression
  async function deleteMateriel(id: number) {
    try {
      //await postAutorized(`/api/materiel/delete/${id}`, null, token.value)
      const i = materiels.value.findIndex(m => m.id === id)
      if (i !== -1) materiels.value.splice(i, 1)
      toast.add({ title: 'Matériel supprimé', color: 'green' })
    } catch (e) {
      toast.add({ title: 'Erreur suppression', color: 'red' })
    }
  }

  // Filtrage par état ou type
  function filterByEtat(etat: string) {
    return materiels.value.filter(m => m.etat === etat)
  }

  return {
    materiels,
    totalMateriels,
    disponibles,
    enMaintenance,
    fetchMateriels,
    addMateriel,
    updateMateriel,
    deleteMateriel,
    filterByEtat
  }
}
