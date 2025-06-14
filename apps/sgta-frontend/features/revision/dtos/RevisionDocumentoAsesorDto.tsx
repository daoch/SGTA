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
	fechaLimiteEntrega: string;
	fechaRevision: string;
	fechaLimiteRevision: string;
	ultimoCiclo: string;
	estado: string;
	formatoValido: boolean,
	citadoCorrecto: boolean,
	urlDescarga: string;
}
