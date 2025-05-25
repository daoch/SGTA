package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.HistorialTemaDto;
import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.model.HistorialTema;
import pucp.edu.pe.sgta.model.Tema;

public class HistorialTemaMapper {

	public static HistorialTemaDto toDto(HistorialTema historialTema) {
		HistorialTemaDto dto = new HistorialTemaDto();
		dto.setId(historialTema.getId());
		dto.setFechaModificacion(historialTema.getFechaModificacion());
		dto.setTitulo(historialTema.getTitulo());
		dto.setResumen(historialTema.getResumen());
		dto.setDescripcionCambio(historialTema.getDescripcionCambio());
		dto.setEstadoTemaId(historialTema.getEstadoTemaId());
		dto.setActivo(historialTema.getActivo());
		dto.setFechaCreacion(historialTema.getFechaCreacion());
		TemaDto temaDto = TemaMapper.toDto(historialTema.getTema());
		dto.setTema(temaDto);
		return dto;
	}

	public static HistorialTema toEntity(HistorialTemaDto dto) {
		HistorialTema historialTema = new HistorialTema();
		historialTema.setId(dto.getId());
		historialTema.setFechaModificacion(dto.getFechaModificacion());
		historialTema.setTitulo(dto.getTitulo());
		historialTema.setResumen(dto.getResumen());
		historialTema.setDescripcionCambio(dto.getDescripcionCambio());
		historialTema.setEstadoTemaId(dto.getEstadoTemaId());
		historialTema.setActivo(dto.getActivo());
		historialTema.setFechaCreacion(dto.getFechaCreacion());
		Tema tema = TemaMapper.toEntity(dto.getTema());
		historialTema.setTema(tema);
		return historialTema;
	}

}
