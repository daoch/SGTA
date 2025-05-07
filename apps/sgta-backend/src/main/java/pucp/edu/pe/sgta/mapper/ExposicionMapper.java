package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.ExposicionDto;
import pucp.edu.pe.sgta.model.Exposicion;
import pucp.edu.pe.sgta.model.EstadoPlanificacion;
import pucp.edu.pe.sgta.model.TipoExposicionXEfXC;

public class ExposicionMapper {

    public static ExposicionDto toDto(Exposicion exposicion) {
        if (exposicion == null) {
            return null;
        }

        ExposicionDto dto = new ExposicionDto();
        dto.setId(exposicion.getId());
        dto.setActivo(exposicion.isActivo());
        dto.setFechaCreacion(exposicion.getFechaCreacion());
        dto.setFechaModificacion(exposicion.getFechaModificacion());

        if (exposicion.getTipoExposicionEfXC() != null) {
            dto.setTipoExposicionEfXCId(exposicion.getTipoExposicionEfXC().getId());
        }

        if (exposicion.getEstadoPlanificacion() != null) {
            dto.setEstadoPlanificacionId(exposicion.getEstadoPlanificacion().getId());
        }

        return dto;
    }

    public static Exposicion toEntity(ExposicionDto dto) {
        if (dto == null) {
            return null;
        }

        Exposicion entity = new Exposicion();
        entity.setId(dto.getId());
        entity.setActivo(dto.isActivo());
        entity.setFechaCreacion(dto.getFechaCreacion());
        entity.setFechaModificacion(dto.getFechaModificacion());

        if (dto.getTipoExposicionEfXCId() != null) {
            TipoExposicionXEfXC tipo = new TipoExposicionXEfXC();
            tipo.setId(dto.getTipoExposicionEfXCId());
            entity.setTipoExposicionEfXC(tipo);
        }

        if (dto.getEstadoPlanificacionId() != null) {
            EstadoPlanificacion estado = new EstadoPlanificacion();
            estado.setId(dto.getEstadoPlanificacionId());
            entity.setEstadoPlanificacion(estado);
        }

        return entity;
    }
}
