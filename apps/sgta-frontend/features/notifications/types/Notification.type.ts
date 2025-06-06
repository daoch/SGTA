export interface Notificacion {
    notificacionId: number;
    mensaje: string;
    canal: string;
    fechaCreacion: string;
    fechaLectura: string | null;
    activo: boolean;
    tipoNotificacion: string;
    prioridad: number;
    modulo: string;
    usuarioId: number;
    nombreUsuario: string;
}