package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.ControlExposicionUsuarioTemaDto;
import pucp.edu.pe.sgta.model.ControlExposicionUsuarioTema;
import pucp.edu.pe.sgta.model.ExposicionXTema;
import pucp.edu.pe.sgta.model.UsuarioXTema;

public class ControlExposicionUsuarioTemaMapper {

	public static ControlExposicionUsuarioTemaDto toDto(ControlExposicionUsuarioTema entity) {
		if (entity == null)
			return null;

		ControlExposicionUsuarioTemaDto dto = new ControlExposicionUsuarioTemaDto();
		dto.setId(entity.getId());
		dto.setExposicionXTemaId(entity.getExposicionXTema() != null ? entity.getExposicionXTema().getId() : null);
		dto.setUsuarioId(entity.getUsuario() != null ? entity.getUsuario().getId() : null);
		dto.setObservacionesFinalesExposicion(entity.getObservacionesFinalesExposicion());
		dto.setAsistio(entity.getAsistio());
		dto.setActivo(entity.getActivo());
		dto.setFechaCreacion(entity.getFechaCreacion());
		dto.setFechaModificacion(entity.getFechaModificacion());
		dto.setEstadoExposicion(entity.getEstadoExposicion());

		return dto;
	}

	public static ControlExposicionUsuarioTema toEntity(ControlExposicionUsuarioTemaDto dto) {
		if (dto == null)
			return null;

		ControlExposicionUsuarioTema entity = new ControlExposicionUsuarioTema();
		entity.setId(dto.getId());
		entity.setObservacionesFinalesExposicion(dto.getObservacionesFinalesExposicion());
		entity.setAsistio(dto.isAsistio());
		entity.setActivo(dto.isActivo());
		entity.setFechaCreacion(dto.getFechaCreacion());
		entity.setFechaModificacion(dto.getFechaModificacion());
		entity.setEstadoExposicion(dto.getEstadoExposicion());

		if (dto.getExposicionXTemaId() != null) {
			ExposicionXTema ext = new ExposicionXTema();
			ext.setId(dto.getExposicionXTemaId());
			entity.setExposicionXTema(ext);
		}

		if (dto.getUsuarioId() != null) {
			UsuarioXTema usuario = new UsuarioXTema();
			usuario.setId(dto.getUsuarioId());
			entity.setUsuario(usuario);
		}

		return entity;
	}

}
