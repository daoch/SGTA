package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.TipoUsuarioDto;
import pucp.edu.pe.sgta.model.TipoUsuario;

public class TipoUsuarioMapper {

	public static TipoUsuarioDto toDto(TipoUsuario tipoUsuario) {
		TipoUsuarioDto dto = new TipoUsuarioDto();
		dto.setId(tipoUsuario.getId());
		dto.setFechaModificacion(tipoUsuario.getFechaModificacion());
		dto.setNombre(tipoUsuario.getNombre());
		dto.setActivo(tipoUsuario.getActivo());
		dto.setFechaCreacion(tipoUsuario.getFechaCreacion());
		dto.setTipoDedicacion(tipoUsuario.getTipoDedicacion());
		return dto;
	}

	public static TipoUsuario toEntity(TipoUsuarioDto dto) {
		TipoUsuario tipoUsuario = new TipoUsuario();
		tipoUsuario.setId(dto.getId());
		tipoUsuario.setFechaModificacion(dto.getFechaModificacion());
		tipoUsuario.setNombre(dto.getNombre());
		tipoUsuario.setActivo(dto.getActivo());
		tipoUsuario.setFechaCreacion(dto.getFechaCreacion());
		tipoUsuario.setTipoDedicacion(dto.getTipoDedicacion());

		return tipoUsuario;
	}

}
