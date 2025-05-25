package pucp.edu.pe.sgta.mapper;

import java.time.OffsetDateTime;

import pucp.edu.pe.sgta.dto.JornadaExposicionXSalaExposicionCreateDTO;
import pucp.edu.pe.sgta.dto.JornadaExposicionXSalaExposicionDto;
import pucp.edu.pe.sgta.model.JornadaExposicion;
import pucp.edu.pe.sgta.model.JornadaExposicionXSalaExposicion;
import pucp.edu.pe.sgta.model.SalaExposicion;

public class JornadaExposicionXSalaExposicionMapper {

	public static JornadaExposicionXSalaExposicionDto toDto(
			JornadaExposicionXSalaExposicion jornadaExposicionXSalaExposicion) {
		JornadaExposicionXSalaExposicionDto dto = new JornadaExposicionXSalaExposicionDto();
		dto.setId(jornadaExposicionXSalaExposicion.getId());
		dto.setJornadaExposicionId(jornadaExposicionXSalaExposicion.getJornadaExposicion().getId());
		dto.setSalaExposicionId(jornadaExposicionXSalaExposicion.getSalaExposicion().getId());
		dto.setActivo(jornadaExposicionXSalaExposicion.getActivo());
		dto.setFechaCreacion(jornadaExposicionXSalaExposicion.getFechaCreacion());
		dto.setFechaModificacion(jornadaExposicionXSalaExposicion.getFechaModificacion());
		return dto;
	}

	public static JornadaExposicionXSalaExposicion toEntity(JornadaExposicionXSalaExposicionDto dto) {
		JornadaExposicionXSalaExposicion jornadaExposicionXSalaExposicion = new JornadaExposicionXSalaExposicion();

		jornadaExposicionXSalaExposicion.setId(dto.getId());

		JornadaExposicion jornadaExposicion = new JornadaExposicion();
		jornadaExposicion.setId(dto.getJornadaExposicionId());
		jornadaExposicionXSalaExposicion.setJornadaExposicion(jornadaExposicion);

		SalaExposicion salaExposicion = new SalaExposicion();
		salaExposicion.setId(dto.getSalaExposicionId());
		jornadaExposicionXSalaExposicion.setSalaExposicion(salaExposicion);

		jornadaExposicionXSalaExposicion.setActivo(dto.getActivo());
		jornadaExposicionXSalaExposicion.setFechaCreacion(dto.getFechaCreacion());
		jornadaExposicionXSalaExposicion.setFechaModificacion(dto.getFechaModificacion());

		return jornadaExposicionXSalaExposicion;
	}

	public static JornadaExposicionXSalaExposicion toEntity(JornadaExposicionXSalaExposicionCreateDTO dto) {
		JornadaExposicionXSalaExposicion jornadaExposicionXSalaExposicion = new JornadaExposicionXSalaExposicion();
		jornadaExposicionXSalaExposicion.setId(dto.getId());

		JornadaExposicion jornadaExposicion = new JornadaExposicion();
		jornadaExposicion.setId(dto.getJornadaExposicionId());
		jornadaExposicionXSalaExposicion.setJornadaExposicion(jornadaExposicion);

		SalaExposicion salaExposicion = new SalaExposicion();
		salaExposicion.setId(dto.getSalaExposicionId());
		jornadaExposicionXSalaExposicion.setSalaExposicion(salaExposicion);

		jornadaExposicionXSalaExposicion.setActivo(true);
		jornadaExposicionXSalaExposicion.setFechaCreacion(OffsetDateTime.now());
		jornadaExposicionXSalaExposicion.setFechaModificacion(OffsetDateTime.now());

		return jornadaExposicionXSalaExposicion;
	}

}
