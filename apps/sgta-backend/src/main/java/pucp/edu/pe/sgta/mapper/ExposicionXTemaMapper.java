package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.ExposicionXTemaDto;
import pucp.edu.pe.sgta.model.*;

public class ExposicionXTemaMapper {

    public static ExposicionXTemaDto toDto(ExposicionXTema entity) {
        if (entity == null)
            return null;

        ExposicionXTemaDto dto = new ExposicionXTemaDto();
        dto.setId(entity.getId());
        dto.setExposicionId(entity.getExposicion() != null ? entity.getExposicion().getId() : null);
        dto.setTemaId(entity.getTema() != null ? entity.getTema().getId() : null);
        dto.setLinkExposicion(entity.getLinkExposicion());
        dto.setLinkGrabacion(entity.getLinkGrabacion());
        dto.setEstadoExposicion(entity.getEstadoExposicion());
        dto.setNotaFinal(entity.getNotaFinal());
        dto.setActivo(entity.getActivo());
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setFechaModificacion(entity.getFechaModificacion());
        return dto;
    }

    public static ExposicionXTema toEntity(ExposicionXTemaDto dto) {
        if (dto == null)
            return null;

        ExposicionXTema entity = new ExposicionXTema();
        entity.setId(dto.getId());
        entity.setLinkExposicion(dto.getLinkExposicion());
        entity.setLinkGrabacion(dto.getLinkGrabacion());
        entity.setEstadoExposicion(dto.getEstadoExposicion());
        entity.setNotaFinal(dto.getNotaFinal());
        entity.setActivo(dto.getActivo());
        entity.setFechaCreacion(dto.getFechaCreacion());
        entity.setFechaModificacion(dto.getFechaModificacion());

        if (dto.getExposicionId() != null) {
            Exposicion exposicion = new Exposicion();
            exposicion.setId(dto.getExposicionId());
            entity.setExposicion(exposicion);
        }

        if (dto.getTemaId() != null) {
            Tema tema = new Tema();
            tema.setId(dto.getTemaId());
            entity.setTema(tema);
        }

        return entity;
    }
}
