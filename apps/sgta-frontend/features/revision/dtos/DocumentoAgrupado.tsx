export interface DocumentoAgrupado {
	id: number;
	titulo: string;
	entregable: string;
	curso: string;
	porcentajeSimilitud: number | null;
	porcentajeGenIA: number | null;
	fechaEntrega: string;
	fechaLimiteEntrega: string;
	fechaRevision: string;
	fechaLimiteRevision: string;
	ultimoCiclo: string;
	estado: string;
	formatoValido: boolean;
	citadoCorrecto: boolean;
	urlDescarga: string;
	estudiantes: {
		nombre: string;
		codigo: string;
	}[];
}
