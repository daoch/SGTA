package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.SubAreaConocimientoDto;
import pucp.edu.pe.sgta.model.SubAreaConocimiento;

public class SubAreaConocimientoMapper {
    public static SubAreaConocimientoDto toDto(SubAreaConocimiento subAreaConocimiento ) {
        SubAreaConocimientoDto dto = new SubAreaConocimientoDto();
        dto.setId(subAreaConocimiento.getId());
        dto.setFechaModificacion(subAreaConocimiento.getFechaModificacion());
        dto.setNombre(subAreaConocimiento.getNombre());
        dto.setActivo(subAreaConocimiento.isActivo());
        dto.setFechaCreacion(subAreaConocimiento.getFechaCreacion());
        //falta areaconocimiento, lo di todo
        return dto;
    }

    public static SubAreaConocimiento toEntity(SubAreaConocimientoDto dto) {
        SubAreaConocimiento subAreaConocimiento = new SubAreaConocimiento();
        subAreaConocimiento.setId(dto.getId());
        subAreaConocimiento.setFechaModificacion(dto.getFechaModificacion());
        subAreaConocimiento.setNombre(dto.getNombre());
        subAreaConocimiento.setActivo(dto.isActivo());
        subAreaConocimiento.setFechaCreacion(dto.getFechaCreacion());

        return subAreaConocimiento;
    }
}
