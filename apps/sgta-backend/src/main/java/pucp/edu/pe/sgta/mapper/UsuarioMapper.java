package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.model.Usuario;

public class UsuarioMapper {
    public static UsuarioDto toDto(Usuario usuario ) {
        UsuarioDto dto = new UsuarioDto();
        dto.setId(usuario.getId());
        dto.setNombres(usuario.getNombres());
        dto.setPrimerApellido(usuario.getPrimerApellido());
        dto.setSegundoApellido(usuario.getSegundoApellido());
        dto.setFechaCreacion(usuario.getFechaCreacion());
        dto.setFechaModificacion(usuario.getFechaModificacion());
        dto.setBiografia(usuario.getBiografia());
        dto.setCodigoPucp(usuario.getCodigoPucp());
        dto.setTipoUsuario(usuario.getTipoUsuario());
        dto.setTipoDisponibilidad(usuario.getTipoDisponibilidad());
        dto.setNivelEstudios(usuario.getNivelEstudios());

        return dto;
    }

    public static Usuario toEntity(UsuarioDto dto) {
        Usuario usuario = new Usuario();
        usuario.setId(dto.getId());
        usuario.setNombres(dto.getNombres());
        usuario.setPrimerApellido(dto.getPrimerApellido());
        usuario.setSegundoApellido(dto.getSegundoApellido());
        usuario.setFechaCreacion(dto.getFechaCreacion());
        usuario.setFechaModificacion(dto.getFechaModificacion());
        usuario.setBiografia(dto.getBiografia());
        usuario.setCodigoPucp(dto.getCodigoPucp());
        usuario.setTipoUsuario(dto.getTipoUsuario());
        usuario.setNivelEstudios(dto.getNivelEstudios());
        usuario.setCorreoElectronico(dto.getCorreoElectronico());
        usuario.setContrasena(dto.getContrasena());
        usuario.setDisponibilidad(dto.getDisponibilidad());
        usuario.setTipoDisponibilidad(dto.getTipoDisponibilidad());

        return usuario;
    }
}
