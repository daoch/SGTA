package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloDto;
import pucp.edu.pe.sgta.model.Ciclo;
import pucp.edu.pe.sgta.model.EtapaFormativa;
import pucp.edu.pe.sgta.model.EtapaFormativaXCiclo;

public class EtapaFormativaXCicloMapper {

	public static EtapaFormativaXCicloDto toDto(EtapaFormativaXCiclo etapaFormativaXCiclo) {
		EtapaFormativaXCicloDto dto = new EtapaFormativaXCicloDto();
		dto.setId(etapaFormativaXCiclo.getId());
		if (etapaFormativaXCiclo.getEtapaFormativa() != null) {
			dto.setEtapaFormativaId(etapaFormativaXCiclo.getEtapaFormativa().getId());
		}
		if (etapaFormativaXCiclo.getCiclo() != null) {
			dto.setCicloId(etapaFormativaXCiclo.getCiclo().getId());
		}
		dto.setActivo(etapaFormativaXCiclo.getActivo());
		dto.setFechaCreacion(etapaFormativaXCiclo.getFechaCreacion());
		dto.setFechaModificacion(etapaFormativaXCiclo.getFechaModificacion());
		return dto;
	}

	public static EtapaFormativaXCiclo toEntity(EtapaFormativaXCicloDto dto) {
		if (dto == null)
			return null;

		EtapaFormativaXCiclo entity = new EtapaFormativaXCiclo();
		entity.setId(dto.getId());
		entity.setActivo(dto.getActivo());
		entity.setFechaCreacion(dto.getFechaCreacion());
		entity.setFechaModificacion(dto.getFechaModificacion());

		// Solo se asignan los objetos con sus IDs; se asume que serán gestionados por
		// el servicio o JPA
		if (dto.getEtapaFormativaId() != null) {
			EtapaFormativa ef = new EtapaFormativa();
			ef.setId(dto.getEtapaFormativaId());
			entity.setEtapaFormativa(ef);
		}

		if (dto.getCicloId() != null) {
			Ciclo ciclo = new Ciclo();
			ciclo.setId(dto.getCicloId());
			entity.setCiclo(ciclo);
		}

		return entity;
	}

}
