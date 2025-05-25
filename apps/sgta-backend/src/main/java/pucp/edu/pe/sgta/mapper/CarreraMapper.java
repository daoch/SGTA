package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.CarreraDto;
import pucp.edu.pe.sgta.model.Carrera;
import pucp.edu.pe.sgta.model.UnidadAcademica;

public class CarreraMapper {

	public static CarreraDto toDto(Carrera carrera) {
		CarreraDto dto = new CarreraDto();
		dto.setId(carrera.getId());
		// si quieres exponer el id de la unidad académica:
		if (carrera.getUnidadAcademica() != null) {
			dto.setUnidadAcademicaId(carrera.getUnidadAcademica().getId());
		}
		dto.setCodigo(carrera.getCodigo());
		dto.setNombre(carrera.getNombre());
		dto.setDescripcion(carrera.getDescripcion());
		dto.setActivo(carrera.getActivo());
		dto.setFechaCreacion(carrera.getFechaCreacion());
		dto.setFechaModificacion(carrera.getFechaModificacion());
		return dto;
	}

	public static Carrera toEntity(CarreraDto dto) {
		Carrera carrera = new Carrera();
		carrera.setId(dto.getId());
		// si vas a persistir la relación, crea un objeto UnidadAcademica mínimo:
		if (dto.getUnidadAcademicaId() != null) {
			var ua = new UnidadAcademica();
			ua.setId(dto.getUnidadAcademicaId());
			carrera.setUnidadAcademica(ua);
		}
		carrera.setCodigo(dto.getCodigo());
		carrera.setNombre(dto.getNombre());
		carrera.setDescripcion(dto.getDescripcion());
		carrera.setActivo(dto.getActivo());
		carrera.setFechaCreacion(dto.getFechaCreacion());
		carrera.setFechaModificacion(dto.getFechaModificacion());
		return carrera;
	}

}
