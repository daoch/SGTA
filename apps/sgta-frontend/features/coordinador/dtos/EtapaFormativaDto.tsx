export interface EtapaFormativaDto {
  id: number;
  nombre: string;
  creditajePorTema: number;
  duracionExposicion: string; // viene como ISO 8601 string, ej. "PT30M"
  activo: boolean;
  carreraId: number;
}