export interface Parcelle {
  id: string;
  nom: string;
  superficie: number; // en hectares
  typeSol: string;
  cultureActuelle?: { id: string; nom: string };
  createdAt: string;
}

export interface Cheptel {
    id: string;
    nom: string;
    typeAnimal: string; // 'Bovin', 'Ovin', 'Volaille'...
    nombreAnimaux: number;
    createdAt: string;
}

// ... (d'autres interfaces : Intervention, Produit, etc.)

// On crée une instance pré-configurée
const $api = $fetch.create({
  baseURL: '/api/v1' // L'URL de base de votre API
  // Ici, vous ajouterez la gestion de l'authentification (headers, etc.)
});

// Exemples de fonctions d'appel
export const getParcelles = () => $api<Parcelle[]>('/parcelles');
export const createParcelle = (data: Omit<Parcelle, 'id' | 'createdAt'>) => $api<Parcelle>('/parcelles', { method: 'POST', body: data });

export const getCheptels = () => $api<Cheptel[]>('/cheptels');
export const createCheptel = (data: Omit<Cheptel, 'id' | 'createdAt'>) => $api<Cheptel>('/cheptels', { method: 'POST', body: data });
// ... (d'autres fonctions : getInterventions, createIntervention, etc.)