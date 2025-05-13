package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.asesores.InfoAreaConocimientoDto;
import pucp.edu.pe.sgta.model.AreaConocimiento;

public class InfoAreaConocimientoMapper {
    public static InfoAreaConocimientoDto toDto(AreaConocimiento area) {
        InfoAreaConocimientoDto dto = new InfoAreaConocimientoDto();
        dto.setIdArea(area.getId());
        dto.setNombre(area.getNombre());
        return dto;
    }
}
