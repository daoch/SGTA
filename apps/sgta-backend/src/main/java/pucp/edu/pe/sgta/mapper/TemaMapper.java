package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.TemaConAsesorJuradoDTO;
import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.model.Carrera;
import pucp.edu.pe.sgta.model.EstadoTema;
import pucp.edu.pe.sgta.model.Tema;

public class TemaMapper {

	public static TemaDto toDto(Tema tema) {
		TemaDto dto = new TemaDto();
		dto.setId(tema.getId());
		dto.setTitulo(tema.getTitulo());
		dto.setCodigo(tema.getCodigo());
		dto.setResumen(tema.getResumen());
		dto.setObjetivos(tema.getObjetivos());
		dto.setMetodologia(tema.getMetodologia());
		dto.setFechaCreacion(tema.getFechaCreacion());
		dto.setFechaLimite(tema.getFechaLimite()); // Assuming fechaLimite is not set in
													// the DTO
		dto.setFechaFinalizacion(tema.getFechaFinalizacion()); // Assuming
																// fechaFinalizacion is
																// not set in the DTO
		dto.setFechaModificacion(tema.getFechaModificacion());
		dto.setPortafolioUrl(tema.getPortafolioUrl());
		if (tema.getEstadoTema() != null) {
			dto.setEstadoTemaNombre(tema.getEstadoTema().getNombre());
		}
		if (tema.getCarrera() != null) {
			dto.setCarrera(CarreraMapper.toDto(tema.getCarrera()));
		}
		return dto;
	}

	public static Tema toEntity(TemaDto dto) {
		Tema tema = new Tema();
		tema.setId(dto.getId());
		tema.setTitulo(dto.getTitulo());
		tema.setCodigo(dto.getCodigo());
		tema.setResumen(dto.getResumen());
		tema.setObjetivos(dto.getObjetivos());
		tema.setMetodologia(dto.getMetodologia());
		tema.setFechaCreacion(dto.getFechaCreacion());
		tema.setFechaLimite(dto.getFechaLimite()); // Assuming fechaLimite is not set in
													// the DTO
		tema.setFechaFinalizacion(dto.getFechaFinalizacion()); // Assuming
																// fechaFinalizacion is
																// not set in the DTO
		tema.setFechaModificacion(dto.getFechaModificacion());
		tema.setPortafolioUrl(dto.getPortafolioUrl());
		if (dto.getCarrera() != null && dto.getCarrera().getId() != null) {
			Carrera carrera = new Carrera();
			carrera.setId(dto.getCarrera().getId());
			tema.setCarrera(carrera);
		}
		if (dto.getEstadoTemaNombre() != null) {
			// sólo seteamos el nombre; el servicio se encargará de buscar la entidad
			// completa
			EstadoTema et = new EstadoTema();
			et.setNombre(dto.getEstadoTemaNombre());
			tema.setEstadoTema(et);
		}
		return tema;
	}

	public static TemaConAsesorJuradoDTO toDtoAsesorJurado(Tema tema) {
		TemaConAsesorJuradoDTO temaConAsesorJuradoDTO = new TemaConAsesorJuradoDTO();
		temaConAsesorJuradoDTO.setId(tema.getId());
		temaConAsesorJuradoDTO.setCodigo(tema.getCodigo());
		temaConAsesorJuradoDTO.setTitulo(tema.getTitulo());
		// en el servicio asignaremos los usuario relacionados a este tema

		return temaConAsesorJuradoDTO;
	}

}
