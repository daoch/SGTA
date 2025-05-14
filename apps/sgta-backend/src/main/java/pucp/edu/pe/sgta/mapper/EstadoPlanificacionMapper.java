package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.EstadoPlanificacionDto;
import pucp.edu.pe.sgta.model.EstadoPlanificacion;

public class EstadoPlanificacionMapper {
    public static EstadoPlanificacionDto toDto(EstadoPlanificacion estadoPlanificacion) {
        EstadoPlanificacionDto dto = new EstadoPlanificacionDto();
        dto.setId(estadoPlanificacion.getId());
        dto.setNombre(estadoPlanificacion.getNombre());
        dto.setActivo(estadoPlanificacion.getActivo());

        return dto;
    }

    public static EstadoPlanificacion toEntity(EstadoPlanificacionDto dto) {
        EstadoPlanificacion estadoPlanificacion = new EstadoPlanificacion();
        estadoPlanificacion.setId(dto.getId());
        estadoPlanificacion.setNombre(dto.getNombre());
        estadoPlanificacion.setActivo(dto.getActivo());

        return estadoPlanificacion;
    }
}
