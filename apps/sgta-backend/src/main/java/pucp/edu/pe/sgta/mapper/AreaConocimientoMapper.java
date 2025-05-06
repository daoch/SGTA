package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.AreaConocimientoDto;
import pucp.edu.pe.sgta.model.AreaConocimiento;
import pucp.edu.pe.sgta.model.Carrera;

public class AreaConocimientoMapper {

	public static AreaConocimientoDto toDto(AreaConocimiento areaConocimiento) {
		AreaConocimientoDto dto = new AreaConocimientoDto();
		dto.setId(areaConocimiento.getId());
		dto.setFechaModificacion(areaConocimiento.getFechaModificacion());
		dto.setNombre(areaConocimiento.getNombre());
		dto.setActivo(areaConocimiento.isActivo());
		dto.setFechaCreacion(areaConocimiento.getFechaCreacion());
        dto.setDescripcion(areaConocimiento.getDescripcion());
        dto.setIdCarrera(areaConocimiento.getCarrera().getId());

		return dto;
	}

	public static AreaConocimiento toEntity(AreaConocimientoDto dto) {
        AreaConocimiento areaConocimiento = new AreaConocimiento();
        areaConocimiento.setId(dto.getId());
        areaConocimiento.setFechaModificacion(dto.getFechaModificacion());
        areaConocimiento.setNombre(dto.getNombre());
        areaConocimiento.setActivo(dto.isActivo());
        areaConocimiento.setFechaCreacion(dto.getFechaCreacion());
        areaConocimiento.setDescripcion(dto.getDescripcion());
		Carrera carrera = new Carrera();
		carrera.setId(dto.getIdCarrera());
		areaConocimiento.setCarrera(carrera);

		return areaConocimiento;
	}

}
