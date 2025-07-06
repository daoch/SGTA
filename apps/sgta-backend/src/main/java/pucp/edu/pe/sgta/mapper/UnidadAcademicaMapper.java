package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.UnidadAcademicaDto;
import pucp.edu.pe.sgta.model.UnidadAcademica;

public class UnidadAcademicaMapper {

    public static UnidadAcademicaDto toDto(UnidadAcademica unidadAcademica) {
        UnidadAcademicaDto dto = new UnidadAcademicaDto();
        dto.setId(unidadAcademica.getId());
        dto.setNombre(unidadAcademica.getNombre());
        dto.setDescripcion(unidadAcademica.getDescripcion());
        dto.setActivo(unidadAcademica.getActivo());
        dto.setFechaCreacion(unidadAcademica.getFechaCreacion());
        dto.setFechaModificacion(unidadAcademica.getFechaModificacion());
        return dto;
    }

    public static UnidadAcademica toEntity(UnidadAcademicaDto unidadAcademicaDto) {
        UnidadAcademica unidadAcademica = new UnidadAcademica();
        unidadAcademica.setId(unidadAcademicaDto.getId());
        unidadAcademica.setNombre(unidadAcademicaDto.getNombre());
        unidadAcademica.setDescripcion(unidadAcademicaDto.getDescripcion());
        unidadAcademica.setActivo(unidadAcademicaDto.getActivo());
        unidadAcademica.setFechaCreacion(unidadAcademicaDto.getFechaCreacion());
        unidadAcademica.setFechaModificacion(unidadAcademicaDto.getFechaModificacion());
        return unidadAcademica;
    }
}