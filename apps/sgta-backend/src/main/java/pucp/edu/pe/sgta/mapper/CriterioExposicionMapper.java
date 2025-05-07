package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.CriterioExposicionDto;
import pucp.edu.pe.sgta.model.CriterioExposicion;
import pucp.edu.pe.sgta.model.Exposicion;

public class CriterioExposicionMapper {
    public static CriterioExposicionDto toDTO(CriterioExposicion criterioExposicion) {
        CriterioExposicionDto dto = new CriterioExposicionDto();
        dto.setId(criterioExposicion.getId());
        dto.setNombre(criterioExposicion.getNombre());
        dto.setDescripcion(criterioExposicion.getDescripcion());
        dto.setFechaCreacion(criterioExposicion.getFechaCreacion());
        dto.setFechaModificacion(criterioExposicion.getFechaModificacion());
        dto.setActivo(criterioExposicion.isActivo());
        dto.setExposicionId(criterioExposicion.getExposicion().getId());
        dto.setNotaMaxima(criterioExposicion.getNotaMaxima());
        return dto;
    }

    public static CriterioExposicion toEntity(CriterioExposicionDto dto) {
        CriterioExposicion criterioExposicion = new CriterioExposicion();
        criterioExposicion.setId(dto.getId());
        criterioExposicion.setNombre(dto.getNombre());
        criterioExposicion.setDescripcion(dto.getDescripcion());
        criterioExposicion.setFechaCreacion(dto.getFechaCreacion());
        criterioExposicion.setFechaModificacion(dto.getFechaModificacion());
        criterioExposicion.setActivo(dto.isActivo());
        criterioExposicion.setNotaMaxima(dto.getNotaMaxima());

        Exposicion exposicion = new Exposicion();
        exposicion.setId(dto.getExposicionId());
        criterioExposicion.setExposicion(exposicion);

        return criterioExposicion;
    }
}
