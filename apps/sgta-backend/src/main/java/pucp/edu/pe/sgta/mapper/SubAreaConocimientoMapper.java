package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.AreaConocimientoDto;
import pucp.edu.pe.sgta.dto.SubAreaConocimientoDto;
import pucp.edu.pe.sgta.model.SubAreaConocimiento;

public class SubAreaConocimientoMapper {

	public static SubAreaConocimientoDto toDto(SubAreaConocimiento subAreaConocimiento, AreaConocimientoDto areaDto) {
		SubAreaConocimientoDto dto = new SubAreaConocimientoDto();
		dto.setId(subAreaConocimiento.getId());
		dto.setFechaModificacion(subAreaConocimiento.getFechaModificacion());
		dto.setNombre(subAreaConocimiento.getNombre());
		dto.setActivo(subAreaConocimiento.getActivo());
		dto.setFechaCreacion(subAreaConocimiento.getFechaCreacion());
		dto.setAreaConocimiento(areaDto);
		return dto;
	}


	public static SubAreaConocimiento toEntity(SubAreaConocimientoDto dto) {
		SubAreaConocimiento subAreaConocimiento = new SubAreaConocimiento();
		subAreaConocimiento.setId(dto.getId());
		subAreaConocimiento.setFechaModificacion(dto.getFechaModificacion());
		subAreaConocimiento.setNombre(dto.getNombre());
		subAreaConocimiento.setActivo(dto.getActivo());
		subAreaConocimiento.setFechaCreacion(dto.getFechaCreacion());
		// AreaConocimiento areaConocimiento = new AreaConocimiento();
		// areaConocimiento.setId(dto.getIdAreaConocimiento());
		subAreaConocimiento.setAreaConocimiento(AreaConocimientoMapper.toEntity(dto.getAreaConocimiento()));
		return subAreaConocimiento;
	}

}
