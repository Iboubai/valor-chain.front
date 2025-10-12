// On peut aussi importer les types pour les propriétés complexes
export interface SoilType {
  id: number;
  name: string;
  // ...
}

export interface Status {
  id: number;
  name: string;
}

// Définition de la classe Parcelle
export class Parcelle {
  id: number;
  userId: string;
  name: string;
  description: string;
  superficie: number;
  type: SoilType | null;
  status: Status | null;
  createdDate: string;
  updatedDate: string | null;
  isActive: boolean;
  speculations: any[] | null;

  // Le constructeur permet de créer de nouvelles instances facilement
  constructor(data: Partial<Parcelle> = {}) {
    this.id = data.id || 0;
    this.userId = data.userId || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.superficie = data.superficie || 0;
    this.type = data.type || null;
    this.status = data.status || null;
    this.createdDate = data.createdDate || new Date().toISOString();
    this.updatedDate = data.updatedDate || null;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.speculations = data.speculations || null;
  }

  // Exemple de méthode (logique métier liée à la parcelle)
  // Retourne le nom complet avec la superficie
  getFullNameWithArea(): string {
    return `${this.name} (${this.superficie} ha)`;
  }

  // Autre exemple : vérifier si la parcelle est en culture
  isCurrentlyCultivated(): boolean {
    return this.status?.name === 'En Culture';
  }
}
