package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.TipoExposicionDto;
import pucp.edu.pe.sgta.model.TipoExposicion;

public class TipoExposicionMapper {

    public static TipoExposicionDto toDto(TipoExposicion tipoExposicion) {
        TipoExposicionDto dto = new TipoExposicionDto();
        dto.setId(tipoExposicion.getId());
        dto.setNombre(tipoExposicion.getNombre());
        dto.setFechaCreacion(tipoExposicion.getFechaCreacion());
        dto.setFechaModificacion(tipoExposicion.getFechaModificacion());
        dto.setActivo(tipoExposicion.getActivo());
        return dto;
    }

    public static TipoExposicion toEntity(TipoExposicionDto dto) {
        TipoExposicion tipoExposicion = new TipoExposicion();
        tipoExposicion.setId(dto.getId());
        tipoExposicion.setNombre(dto.getNombre());
        tipoExposicion.setFechaCreacion(dto.getFechaCreacion());
        tipoExposicion.setFechaModificacion(dto.getFechaModificacion());
        tipoExposicion.setActivo(dto.getActivo());
        return tipoExposicion;
    }
}
