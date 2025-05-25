package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.CriterioEntregableDto;
import pucp.edu.pe.sgta.model.CriterioEntregable;

public class CriterioEntregableMapper {

	public static CriterioEntregableDto toDto(CriterioEntregable criterioEntregable) {
		CriterioEntregableDto dto = new CriterioEntregableDto();
		dto.setId(criterioEntregable.getId());
		dto.setNombre(criterioEntregable.getNombre());
		dto.setNotaMaxima(criterioEntregable.getNotaMaxima());
		dto.setDescripcion(criterioEntregable.getDescripcion());

		return dto;
	}

	public static CriterioEntregable toEntity(CriterioEntregableDto dto) {
		CriterioEntregable criterioEntregable = new CriterioEntregable();
		criterioEntregable.setId(dto.getId());
		criterioEntregable.setNombre(dto.getNombre());
		criterioEntregable.setNotaMaxima(dto.getNotaMaxima());
		criterioEntregable.setDescripcion(dto.getDescripcion());

		return criterioEntregable;
	}

}
