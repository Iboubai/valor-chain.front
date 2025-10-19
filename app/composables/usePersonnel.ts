// composables/usePersonnel.ts
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'
import { useToast } from '#imports'

export interface Personnel {
  id?: number
  matricule: string
  nomComplet: string
  poste: string
  service: string
  contact: string
  email?: string
  adresse?: string
  dateEmbauche: string
  statut: 'Actif' | 'En congé' | 'Suspendu' | 'Démissionné'
  salaire?: number
  observation?: string
}

export function usePersonnel() {
  const personnels = ref<Personnel[]>([])
  const { get, postAutorized } = useApi()
  const { token } = useAuth()
  const toast = useToast()

  const totalPersonnel = computed(() => personnels.value.length)
  const actifs = computed(() => personnels.value.filter(p => p.statut === 'Actif'))
  const enConge = computed(() => personnels.value.filter(p => p.statut === 'En congé'))

  // Récupération
  async function fetchPersonnel() {
    try {
      const res = await get('/api/personnel/all')
      personnels.value = res.data || []
    } catch (e) {
      console.error(e)
      toast.add({ title: 'Erreur de chargement du personnel', color: 'red' })
    }
  }

  // Ajout
  async function addPersonnel(p: Personnel) {
    try {
      //const res = await postAutorized('/api/personnel/create', p, token.value)
      //personnels.value.push(res.data || p)
      personnels.value.push(p)
      toast.add({ title: 'Personnel ajouté', color: 'green' })
    } catch (e) {
      toast.add({ title: 'Erreur ajout personnel', color: 'red' })
    }
  }

  // Mise à jour
  async function updatePersonnel(p: Personnel) {
    try {
      //await postAutorized(`/api/personnel/update/${p.id}`, p, token.value)
      const i = personnels.value.findIndex(el => el.id === p.id)
      if (i !== -1) personnels.value[i] = p
      toast.add({ title: 'Informations mises à jour', color: 'green' })
    } catch (e) {
      toast.add({ title: 'Erreur mise à jour', color: 'red' })
    }
  }

  // Suppression
  async function deletePersonnel(id: number) {
    try {
      //await postAutorized(`/api/personnel/delete/${id}`, null, token.value)
      const i = personnels.value.findIndex(p => p.id === id)
      if (i !== -1) personnels.value.splice(i, 1)
      toast.add({ title: 'Personnel supprimé', color: 'green' })
    } catch (e) {
      toast.add({ title: 'Erreur suppression', color: 'red' })
    }
  }

  // Filtrage
  function filterByService(service: string) {
    return personnels.value.filter(p => p.service === service)
  }

  return {
    personnels,
    totalPersonnel,
    actifs,
    enConge,
    fetchPersonnel,
    addPersonnel,
    updatePersonnel,
    deletePersonnel,
    filterByService
  }
}
