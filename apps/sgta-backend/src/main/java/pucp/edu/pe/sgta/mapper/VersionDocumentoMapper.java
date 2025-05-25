package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.VersionDocumentoDto;
import pucp.edu.pe.sgta.model.VersionXDocumento;

public class VersionDocumentoMapper {

	public static VersionDocumentoDto toDto(VersionXDocumento entity) {
		VersionDocumentoDto dto = new VersionDocumentoDto();
		dto.setId(entity.getId());
		dto.setDocumento(entity.getDocumento());
		dto.setRevisionDocumentoId(entity.getRevisionDocumentoId());
		dto.setFechaUltimaSubida(entity.getFechaUltimaSubida());
		dto.setNumeroVersion(entity.getNumeroVersion());
		dto.setLinkArchivoSubido(entity.getLinkArchivoSubido());
		dto.setActivo(entity.isActivo());
		dto.setFechaCreacion(entity.getFechaCreacion());
		dto.setFechaModificacion(entity.getFechaModificacion());
		return dto;
	}

	public static VersionXDocumento toEntity(VersionDocumentoDto dto) {
		VersionXDocumento entity = new VersionXDocumento();
		entity.setId(dto.getId());
		entity.setDocumento(dto.getDocumento());
		entity.setRevisionDocumentoId(dto.getRevisionDocumentoId());
		entity.setFechaUltimaSubida(dto.getFechaUltimaSubida());
		entity.setNumeroVersion(dto.getNumeroVersion());
		entity.setLinkArchivoSubido(dto.getLinkArchivoSubido());
		entity.setActivo(dto.isActivo());
		entity.setFechaCreacion(dto.getFechaCreacion());
		entity.setFechaModificacion(dto.getFechaModificacion());
		return entity;
	}

}