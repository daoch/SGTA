export interface CriterioEntregableDetalle {
    criterioId: number;
    criterioNombre: string;
    notaMaxima: number;
    notaCriterio: number | null;
}

export interface EntregableCriteriosDetalle {
    entregableId: number;
    entregableNombre: string;
    fechaEnvio: string | null;
    notaGlobal: number | null;
    estadoEntrega: string;
    criterios: CriterioEntregableDetalle[];
    etapaFormativaXCicloId: number | null;
    esEvaluable: boolean | null;
} 