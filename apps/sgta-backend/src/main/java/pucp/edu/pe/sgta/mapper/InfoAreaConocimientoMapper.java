package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.InfoAreaConocimiento;
import pucp.edu.pe.sgta.dto.InfoSubAreaConocimientoDto;

public class InfoAreaConocimientoMapper {
    public static InfoSubAreaConocimientoDto toDto(InfoAreaConocimiento infoAreaConocimiento) {
        InfoSubAreaConocimientoDto dto = new InfoSubAreaConocimientoDto();
        dto.setId(infoAreaConocimiento.getId());
        dto.setNombre(infoAreaConocimiento.getNombre());
        return dto;
    }
}
