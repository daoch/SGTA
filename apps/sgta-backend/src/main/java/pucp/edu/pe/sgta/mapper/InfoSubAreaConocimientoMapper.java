package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.asesores.InfoSubAreaConocimientoDto;
import pucp.edu.pe.sgta.model.SubAreaConocimiento;

public class InfoSubAreaConocimientoMapper {
    static public InfoSubAreaConocimientoDto toDto(SubAreaConocimiento subArea){
        InfoSubAreaConocimientoDto dto = new InfoSubAreaConocimientoDto();
        dto.setIdTema(subArea.getId());
        dto.setNombre(subArea.getNombre());
        dto.setAreaTematica(InfoAreaConocimientoMapper.toDto(subArea.getAreaConocimiento()));
        return dto;
    }
}
