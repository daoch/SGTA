package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.ExposicionDto;
import pucp.edu.pe.sgta.model.Exposicion;
import pucp.edu.pe.sgta.model.EstadoPlanificacion;
import pucp.edu.pe.sgta.model.EtapaFormativaXCiclo;

public class ExposicionMapper {

    public static ExposicionDto toDto(Exposicion exposicion) {
        if (exposicion == null) {
            return null;
        }

        ExposicionDto dto = new ExposicionDto();
        dto.setId(exposicion.getId());
        dto.setNombre(exposicion.getNombre());
        dto.setDescripcion(exposicion.getDescripcion());

        if (exposicion.getEtapaFormativaXCiclo() != null) {
            dto.setEtapaFormativaXCicloId(exposicion.getEtapaFormativaXCiclo().getId());
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
        entity.setNombre(dto.getNombre());
        entity.setDescripcion(dto.getDescripcion());

        if (dto.getEtapaFormativaXCicloId() != null) {
            EtapaFormativaXCiclo tipo = new EtapaFormativaXCiclo();
            tipo.setId(dto.getEtapaFormativaXCicloId());
            entity.setEtapaFormativaXCiclo(tipo);
        }

        if (dto.getEstadoPlanificacionId() != null) {
            EstadoPlanificacion estado = new EstadoPlanificacion();
            estado.setId(dto.getEstadoPlanificacionId());
            entity.setEstadoPlanificacion(estado);
        }

        return entity;
    }

}
