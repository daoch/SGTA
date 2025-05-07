package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.RestriccionExposicionDto;
import pucp.edu.pe.sgta.model.ExposicionXTema;
import pucp.edu.pe.sgta.model.RestriccionExposicion;

public class RestriccionExposicionMapper {

    public static RestriccionExposicionDto toDto(RestriccionExposicion entity) {
        if (entity == null)
            return null;

        RestriccionExposicionDto dto = new RestriccionExposicionDto();
        dto.setId(entity.getId());
        dto.setExposicionXTemaId(entity.getExposicionXTema() != null ? entity.getExposicionXTema().getId() : null);
        dto.setDatetimeInicio(entity.getDatetimeInicio());
        dto.setDatetimeFin(entity.getDatetimeFin());
        dto.setActivo(entity.isActivo());
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setFechaModificacion(entity.getFechaModificacion());
        return dto;
    }

    public static RestriccionExposicion toEntity(RestriccionExposicionDto dto) {
        if (dto == null)
            return null;

        RestriccionExposicion entity = new RestriccionExposicion();
        entity.setId(dto.getId());
        entity.setDatetimeInicio(dto.getDatetimeInicio());
        entity.setDatetimeFin(dto.getDatetimeFin());
        entity.setActivo(dto.isActivo());
        entity.setFechaCreacion(dto.getFechaCreacion());
        entity.setFechaModificacion(dto.getFechaModificacion());

        if (dto.getExposicionXTemaId() != null) {
            ExposicionXTema exposicionXTema = new ExposicionXTema();
            exposicionXTema.setId(dto.getExposicionXTemaId());
            entity.setExposicionXTema(exposicionXTema);
        }

        return entity;
    }
}
