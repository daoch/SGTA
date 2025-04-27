// src/features/configuracion-academica/types/index.ts

export type CursoType = 'PFC1' | 'PFC2';
export type EstadoCronogramaType = 'BORRADOR' | 'PUBLICADO' | 'ARCHIVADO' | 'NO_CREADO';

export interface Hito {
  id: string;
  orden: number;
  tipo: 'Entregable' | 'Exposición';
  nombre: string;
  descripcion: string;
  semana: number; 
  requiereAsesor: boolean;
  requiereJurado: boolean;
}

export interface EstadoCronograma {
  estado: EstadoCronogramaType;
  fechaPublicacion: string | null; 
}

export interface CronogramaPlantilla {
    ciclo: string;
    curso: CursoType;
    estadoInfo: EstadoCronograma;
    hitos: Hito[];
}

export interface CicloInfo {
    id: string;
    nombre: string; 
    esActual?: boolean;
    esProximo?: boolean;
    esAnterior?: boolean;
    puedeConfigurarProximo?: boolean;
}

export interface ModoCreacionState {
    activo: boolean;
    copiarDesdeCicloId: string | null; 
    empezarCero: boolean;
}

// AREAS TEMATICAS
export interface AreaTematica {
  id: string; // ID único
  nombre: string;
  descripcion: string;
  // Datos adicionales que podrían venir del backend:
  proyectosAsociados?: number; // Cuántos proyectos la usan
  asesoresAsociados?: number; // Cuántos asesores la tienen
  fechaCreacion?: string | Date;
  fechaModificacion?: string | Date;
  // Estado (si aplica, ej. 'activa', 'obsoleta')
  // estado?: string; 
}

// Tipo para el formulario (puede omitir el ID al crear)
export type AreaTematicaFormValues = Omit<AreaTematica, 'id' | 'proyectosAsociados' | 'asesoresAsociados' | 'fechaCreacion' | 'fechaModificacion'> & { id?: string };

// OLD
export interface Area {
  id: string;
  name: string;
  specialty: string;
  faculty: string;
  description: string;
  advisorCount: number;
  active: boolean;
  createdAt: string;
}

export interface CoordinatorData {
  id: string;
  name: string;
  faculty: string;
  specialty: string;
  email: string;
}

export interface AreaFormData {
  name: string;
  description: string;
}

// Interfaces para los props de los componentes

export interface EmptyStateProps {
  activeTab: 'active' | 'inactive';
  specialty: string;
  openAddDialog: () => void;
}

export interface SuccessAlertProps {
  message: string;
}

export interface AreasListProps {
  areas: Area[];
  openEditDialog: (area: Area) => void;
  openViewDialog: (area: Area) => void;
  openDeactivateDialog: (area: Area) => void;
}

export interface AddAreaDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formData: AreaFormData;
  setFormData: React.Dispatch<React.SetStateAction<AreaFormData>>;
  handleAddArea: () => void;
  coordinatorData: CoordinatorData;
}

export interface EditAreaDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formData: AreaFormData;
  setFormData: React.Dispatch<React.SetStateAction<AreaFormData>>;
  handleEditArea: () => void;
}

export interface ViewAreaDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentArea: Area | null;
  openEditDialog: () => void;
}

export interface ActivationDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentArea: Area | null;
  handleDeactivateArea: () => void;
}