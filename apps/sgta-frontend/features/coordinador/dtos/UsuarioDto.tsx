import { TipoDedicacionDto } from "./TipoDedicacionDto";
import { TipoUsuarioDto } from "./TipoUsuarioDto";

export interface UsuarioDto {
    id: number;
    tipoUsuario: TipoUsuarioDto;
    codigoPucp: string;
    nombres: string;
    primerApellido: string;
    segundoApellido: string;
    correoElectronico: string;
    nivelEstudios: string;
    comentario: string;
    biografia: string;
    enlaceRepositorio: string;
    enlaceLinkedin: string;
    disponibilidad: string;
    tipoDisponibilidad: string;
    tipoDedicacion: TipoDedicacionDto;
    rol: string;
    activo: boolean;
    rechazado: boolean;
    creador: boolean;
    fechaCreacion: string;
    fechaModificacion: string;
    asignado: boolean;
}
