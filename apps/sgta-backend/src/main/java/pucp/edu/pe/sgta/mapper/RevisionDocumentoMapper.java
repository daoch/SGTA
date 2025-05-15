package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.RevisionDocumentoDto;
import pucp.edu.pe.sgta.model.RevisionXDocumento;

public class RevisionDocumentoMapper {

    public static RevisionDocumentoDto toDto(RevisionXDocumento entity) {
        RevisionDocumentoDto dto = new RevisionDocumentoDto();
        dto.setId(entity.getId());
        dto.setUsuarioId(entity.getUsuarioId());
        dto.setVersionDocumentoId(entity.getVersionDocumento().getId());
        dto.setFechaLimiteRevision(entity.getFechaLimiteRevision());
        dto.setFechaRevision(entity.getFechaRevision());
        dto.setEstadoRevision(entity.getEstadoRevision());
        dto.setLinkArchivoRevision(entity.getLinkArchivoRevision());
        dto.setActivo(entity.isActivo());
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setFechaModificacion(entity.getFechaModificacion());
        return dto;
    }

    public static RevisionXDocumento toEntity(RevisionDocumentoDto dto) {
        RevisionXDocumento entity = new RevisionXDocumento();
        entity.setId(dto.getId());
        entity.setUsuarioId(dto.getUsuarioId());
        entity.getVersionDocumento().setId(dto.getVersionDocumentoId());
        entity.setFechaLimiteRevision(dto.getFechaLimiteRevision());
        entity.setFechaRevision(dto.getFechaRevision());
        entity.setEstadoRevision(dto.getEstadoRevision());
        entity.setLinkArchivoRevision(dto.getLinkArchivoRevision());
        entity.setActivo(dto.isActivo());
        entity.setFechaCreacion(dto.getFechaCreacion());
        entity.setFechaModificacion(dto.getFechaModificacion());
        return entity;
    }
}