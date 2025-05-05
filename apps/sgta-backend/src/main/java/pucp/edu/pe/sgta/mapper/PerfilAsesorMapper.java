package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.PerfilAsesorDto;
import pucp.edu.pe.sgta.model.Usuario;

public class PerfilAsesorMapper {
    public static PerfilAsesorDto toDto(Usuario usuario) {
        PerfilAsesorDto dto = new PerfilAsesorDto();
        dto.setNombres(usuario.getNombres());
        dto.setApellido(usuario.getPrimerApellido());
        dto.setBiografia(usuario.getBiografia());
        dto.setCorreo(usuario.getCorreoElectronico());
        dto.setEnlace_linkedin(usuario.getEnlaceLinkedin());
        dto.setEnlace_repositorio(usuario.getEnlaceRepositorio());
        dto.setNivelEstudios(usuario.getNivelEstudios());
        return dto;
    }
}
