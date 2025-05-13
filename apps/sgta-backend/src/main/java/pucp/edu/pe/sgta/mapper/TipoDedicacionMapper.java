package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.TipoDedicacionDto;
import pucp.edu.pe.sgta.model.TipoDedicacion;

public class TipoDedicacionMapper {

    public static TipoDedicacion toEntity(TipoDedicacionDto dto) {
        TipoDedicacion tipoDedicacion = new TipoDedicacion();
        tipoDedicacion.setId(dto.getId());
        tipoDedicacion.setIniciales(dto.getIniciales());
        tipoDedicacion.setDescripcion(dto.getDescripcion());
        tipoDedicacion.setActivo(dto.getActivo());
        tipoDedicacion.setFechaCreacion(dto.getFechaCreacion());
        tipoDedicacion.setFechaModificacion(dto.getFechaModificacion());
        return tipoDedicacion;
    }

    public static TipoDedicacionDto toDto(TipoDedicacion entity) {
        TipoDedicacionDto dto = new TipoDedicacionDto();
        dto.setId(entity.getId());
        dto.setIniciales(entity.getIniciales());
        dto.setDescripcion(entity.getDescripcion());
        dto.setActivo(entity.getActivo());
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setFechaModificacion(entity.getFechaModificacion());
        return dto;
    }
}
