package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.UsuarioDocumentoDto;
import pucp.edu.pe.sgta.model.UsuarioXDocumento;

public class UsuarioDocumentoMapper {

    public static UsuarioDocumentoDto toDto(UsuarioXDocumento entity) {
        UsuarioDocumentoDto dto = new UsuarioDocumentoDto();
        dto.setId(entity.getUsuarioDocumentoId());
        dto.setUsuarioId(entity.getUsuario().getId());
        dto.setDocumentoId(entity.getDocumento().getId());
        dto.setPermiso(entity.getPermiso());
        dto.setActivo(entity.getActivo());
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setFechaModificacion(entity.getFechaModificacion());
        return dto;
    }

    public static UsuarioXDocumento toEntity(UsuarioDocumentoDto dto) {
        UsuarioXDocumento entity = new UsuarioXDocumento();
        entity.setUsuarioDocumentoId(dto.getId());
        entity.getUsuario().setId(dto.getUsuarioId());
        entity.getDocumento().setId(dto.getDocumentoId());
        entity.setPermiso(dto.getPermiso());
        entity.setActivo(dto.isActivo());
        entity.setFechaCreacion(dto.getFechaCreacion());
        entity.setFechaModificacion(dto.getFechaModificacion());
        return entity;
    }
}
