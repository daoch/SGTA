export interface RevisionDocumentoAsesorDto {
	id: number;
	titulo: string;
	entregable: string;
	estudiante: string;
	codigo: string;
	curso: string;
	porcentajeSimilitud: number | null;
	porcentajeGenIA: number | null;
	fechaEntrega: string;
	entregaATiempo: boolean;
	fechaLimite: string;
	ultimoCiclo: string;
	estado: string;
	formatoValido: boolean,
	citadoCorrecto: boolean,
	urlDescarga: string;
}
