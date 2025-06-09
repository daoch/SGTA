export interface EtapaFormativaXCiclo {
  id: number;
  etapaFormativaId: number;
  cicloId: number;
  carreraId: number;
  activo: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
  nombreEtapaFormativa: string;
  creditajePorTema: number;
  duracionExposicion: string;
  nombreCiclo: string;
};
