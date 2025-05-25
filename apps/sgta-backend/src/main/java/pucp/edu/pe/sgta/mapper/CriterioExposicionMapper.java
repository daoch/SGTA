package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.CriterioExposicionDto;
import pucp.edu.pe.sgta.model.CriterioExposicion;
import pucp.edu.pe.sgta.model.Exposicion;

public class CriterioExposicionMapper {

	public static CriterioExposicionDto toDto(CriterioExposicion criterioExposicion) {
		if (criterioExposicion == null) {
			return null;
		}

		CriterioExposicionDto dto = new CriterioExposicionDto();
		dto.setId(criterioExposicion.getId());
		dto.setNombre(criterioExposicion.getNombre());
		dto.setDescripcion(criterioExposicion.getDescripcion());
		if (criterioExposicion.getExposicion() != null) {
			dto.setExposicionId(criterioExposicion.getExposicion().getId());
		}
		dto.setNotaMaxima(criterioExposicion.getNotaMaxima());
		return dto;
	}

	public static CriterioExposicion toEntity(CriterioExposicionDto dto) {
		if (dto == null) {
			return null;
		}

		CriterioExposicion criterioExposicion = new CriterioExposicion();
		criterioExposicion.setId(dto.getId());
		criterioExposicion.setNombre(dto.getNombre());
		criterioExposicion.setDescripcion(dto.getDescripcion());
		criterioExposicion.setNotaMaxima(dto.getNotaMaxima());
		if (dto.getExposicionId() != null) {
			Exposicion exposicion = new Exposicion();
			exposicion.setId(dto.getExposicionId());
			criterioExposicion.setExposicion(exposicion);
		}

		return criterioExposicion;
	}

}
