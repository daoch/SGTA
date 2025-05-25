package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.CicloDto;
import pucp.edu.pe.sgta.model.Ciclo;

public class CicloMapper {

	public static CicloDto toDto(Ciclo ciclo) {
		CicloDto dto = new CicloDto();
		dto.setId(ciclo.getId());
		dto.setSemestre(ciclo.getSemestre());
		dto.setAnio(ciclo.getAnio());
		dto.setFechaInicio(ciclo.getFechaInicio());
		dto.setFechaFin(ciclo.getFechaFin());
		dto.setActivo(ciclo.getActivo());
		dto.setFechaCreacion(ciclo.getFechaCreacion());
		dto.setFechaModificacion(ciclo.getFechaModificacion());
		return dto;
	}

	public static Ciclo toEntity(CicloDto dto) {
		Ciclo ciclo = new Ciclo();
		ciclo.setId(dto.getId());
		ciclo.setSemestre(dto.getSemestre());
		ciclo.setAnio(dto.getAnio());
		ciclo.setFechaInicio(dto.getFechaInicio());
		ciclo.setFechaFin(dto.getFechaFin());
		ciclo.setActivo(dto.getActivo());
		ciclo.setFechaCreacion(dto.getFechaCreacion());
		ciclo.setFechaModificacion(dto.getFechaModificacion());
		return ciclo;
	}

}