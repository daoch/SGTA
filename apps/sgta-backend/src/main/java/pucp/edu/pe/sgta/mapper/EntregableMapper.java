package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.EntregableDto;
import pucp.edu.pe.sgta.model.Entregable;

public class EntregableMapper {

    public static EntregableDto toDto(Entregable entregable) {
        EntregableDto dto = new EntregableDto();
        dto.setId(entregable.getId());
        dto.setNombre(entregable.getNombre());
        dto.setDescripcion(entregable.getDescripcion());
        dto.setFechaInicio(entregable.getFechaInicio());
        dto.setFechaFin(entregable.getFechaFin());
        dto.setEsEvaluable(entregable.isEsEvaluable());

        return dto;
    }

    public static Entregable toEntity(EntregableDto dto) {
        Entregable entregable = new Entregable();
        entregable.setId(dto.getId());
        entregable.setNombre(dto.getNombre());
        entregable.setDescripcion(dto.getDescripcion());
        entregable.setFechaInicio(dto.getFechaInicio());
        entregable.setFechaFin(dto.getFechaFin());
        entregable.setEsEvaluable(dto.isEsEvaluable());

        return entregable;
    }

}