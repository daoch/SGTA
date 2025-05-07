package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.SalaExposicionDto;
import pucp.edu.pe.sgta.model.SalaExposicion;

public class SalaExposicionMapper {
    public static SalaExposicionDto tDto(SalaExposicion salaExposicion) {
        SalaExposicionDto dto = new SalaExposicionDto();
        dto.setId(salaExposicion.getId());
        dto.setNombre(salaExposicion.getNombre());
        dto.setFechaCreacion(salaExposicion.getFechaCreacion());
        dto.setFechaModificacion(salaExposicion.getFechaModificacion());
        dto.setActivo(salaExposicion.isActivo());
        dto.setTipoSalaExposicion(salaExposicion.getTipoSalaExposicion());
        return dto;
    }

    public static SalaExposicion toEntity(SalaExposicionDto dto) {
        SalaExposicion salaExposicion = new SalaExposicion();
        salaExposicion.setId(dto.getId());
        salaExposicion.setNombre(dto.getNombre());
        salaExposicion.setFechaCreacion(dto.getFechaCreacion());
        salaExposicion.setFechaModificacion(dto.getFechaModificacion());
        salaExposicion.setActivo(dto.isActivo());
        salaExposicion.setTipoSalaExposicion(dto.getTipoSalaExposicion());
        return salaExposicion;
    }
}
