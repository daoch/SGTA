package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.RevisionCriterioExposicionDto;
import pucp.edu.pe.sgta.model.*;

public class RevisionCriterioExposicionMapper {

    public static RevisionCriterioExposicion toEntity(RevisionCriterioExposicionDto dto) {
        if (dto == null)
            return null;

        RevisionCriterioExposicion entity = new RevisionCriterioExposicion();
        entity.setId(dto.getId());
        entity.setNota(dto.getNota());
        entity.setRevisado(dto.isRevisado());
        entity.setObservacion(dto.getObservacion());
        entity.setActivo(dto.isActivo());
        entity.setFechaCreacion(dto.getFechaCreacion());
        entity.setFechaModificacion(dto.getFechaModificacion());

        if (dto.getExposicionXTemaId() != null) {
            ExposicionXTema ext = new ExposicionXTema();
            ext.setId(dto.getExposicionXTemaId());
            entity.setExposicionXTema(ext);
        }

        if (dto.getCriterioExposicionId() != null) {
            CriterioExposicion ce = new CriterioExposicion();
            ce.setId(dto.getCriterioExposicionId());
            entity.setCriterioExposicion(ce);
        }

        if (dto.getUsuarioId() != null) {
            Usuario usuario = new Usuario();
            usuario.setId(dto.getUsuarioId());
            entity.setUsuario(usuario);
        }

        return entity;
    }

    public static RevisionCriterioExposicionDto toDto(RevisionCriterioExposicion entity) {
        if (entity == null)
            return null;

        RevisionCriterioExposicionDto dto = new RevisionCriterioExposicionDto();
        dto.setId(entity.getId());
        dto.setNota(entity.getNota());
        dto.setRevisado(entity.isRevisado());
        dto.setObservacion(entity.getObservacion());
        dto.setActivo(entity.isActivo());
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setFechaModificacion(entity.getFechaModificacion());

        if (entity.getExposicionXTema() != null) {
            dto.setExposicionXTemaId(entity.getExposicionXTema().getId());
        }

        if (entity.getCriterioExposicion() != null) {
            dto.setCriterioExposicionId(entity.getCriterioExposicion().getId());
        }

        if (entity.getUsuario() != null) {
            dto.setUsuarioId(entity.getUsuario().getId());
        }

        return dto;
    }
}
