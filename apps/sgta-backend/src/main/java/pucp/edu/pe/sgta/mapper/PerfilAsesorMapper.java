package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.asesores.PerfilAsesorDto;
import pucp.edu.pe.sgta.model.Usuario;

public class PerfilAsesorMapper {

	public static PerfilAsesorDto toDto(Usuario usuario) {
		PerfilAsesorDto dto = new PerfilAsesorDto();
		dto.setId(usuario.getId());
		dto.setNombre(usuario.getNombreDisplay());
		dto.setEmail(usuario.getCorreoElectronico());
		dto.setLinkedin(usuario.getEnlaceLinkedin());
		dto.setRepositorio(usuario.getEnlaceRepositorio());
		dto.setBiografia(usuario.getBiografia());
		return dto;
	}

}
