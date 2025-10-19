// composables/Parcelle.ts

// Interfaces pour les objets imbriqués
export interface SoilType {
  id: number;
  name: string;
  description: string;
  caracteristiques: string;
}

export interface Status {
  id: number;
  name: string;
}

export interface SpeculationData {
  id?: number; // L'ID de la spéculation de base
  parcelleId: number
  name: string;
  variety: string;
  plantingDate: string;
  density: number;
  speculationId: number;
}

export interface TaskData {
  id?: number;
  parcelleId: number
  title: string;
  startDate: string;
  endDate: string;
  progress: number;
  done: boolean;
}

export interface BudgetData {
  id?: number;
  parcelleId: number
  title: string;
  type: string;
  amount: number;
  executionDate: string;
}

// La classe principale
export class Parcelle {
  id: number | null;
  userId: string;
  name: string;
  description: string;
  superficie: number | null;
  type: SoilType | null;
  typeId: number | null;
  status: Status | null;
  statusId: number | null;
  createdDate: string;
  updatedDate: string | null;
  isActive: boolean;
  speculations: SpeculationData[];
  tasks: TaskData[];
  budgets: BudgetData[];

  constructor(data?: Partial<Parcelle>) {
    this.id = data?.id || null;
    this.userId = data?.userId || '';
    this.name = data?.name || '';
    this.description = data?.description || '';
    this.superficie = data?.superficie || null;
    
    // Initialisation sécurisée des objets imbriqués
    this.type = data?.type || null;
    this.status = data?.status || null;
    this.typeId = data?.typeId || null;
    this.statusId = data?.statusId || null;
    
    this.createdDate = data?.createdDate || new Date().toISOString();
    this.updatedDate = data?.updatedDate || null;
    this.isActive = data?.isActive ?? true; // '??' gère correctement `false`
    
    // Assure que 'speculations' est toujours un tableau
    this.speculations = data?.speculations || [];
    this.tasks = data?.tasks || [];
    this.budgets = data?.budgets || [];
  }
}
