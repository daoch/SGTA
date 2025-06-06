export interface OverdueSummary {
    total: number;
    mensajes: string[];
    entregablesVencidos: EntregableVencido[];
}

export interface EntregableVencido {
    "entregableId": number,
    "nombreEntregable": string,
    "fechaVencimiento": string | Date | null,
    "diasAtraso": number,
    "nombreTema": string,
    "temaId": number
}