package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.InfoSubAreaConocimientoDto;
import pucp.edu.pe.sgta.model.SubAreaConocimiento;

public class InfoSubAreaConocimientoMapper {
    static public InfoSubAreaConocimientoDto toDto(SubAreaConocimiento subArea){
        InfoSubAreaConocimientoDto dto = new InfoSubAreaConocimientoDto();
        dto.setId(subArea.getId());
        dto.setNombre(subArea.getNombre());
        dto.setIdPadre(subArea.getAreaConocimiento().getId());
        return dto;
    }
}
