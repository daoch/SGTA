package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.AreaConocimientoDto;
import pucp.edu.pe.sgta.model.AreaConocimiento;

public class AreaConocimientoMapper {

    public static AreaConocimientoDto toDto(AreaConocimiento areaConocimiento) {
        AreaConocimientoDto dto = new AreaConocimientoDto();
        dto.setId(areaConocimiento.getId());
        dto.setFechaModificacion(areaConocimiento.getFechaModificacion());
        dto.setNombre(areaConocimiento.getNombre());
        dto.setActivo(areaConocimiento.isActivo());
        dto.setFechaCreacion(areaConocimiento.getFechaCreacion());

        return dto;
    }

}
