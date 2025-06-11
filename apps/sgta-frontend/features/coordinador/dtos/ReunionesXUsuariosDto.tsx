import { UsuarioDto } from "./UsuarioDto";

export interface ReunionesXUsuariosDto {
    asesor: UsuarioDto;
    alumno: UsuarioDto;
    coasesor: UsuarioDto;
    estado: string;
    curso: string;
}
