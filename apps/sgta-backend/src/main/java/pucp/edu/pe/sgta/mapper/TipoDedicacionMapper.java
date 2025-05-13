package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.TipoDedicacionDto;
import pucp.edu.pe.sgta.model.TipoDedicacion;

public class TipoDedicacionMapper {

    public static TipoDedicacionDto toDto(TipoDedicacion tipoDedicacion) {
        TipoDedicacionDto dto = new TipoDedicacionDto();
        dto.setId(tipoDedicacion.getId());
        dto.setFechaModificacion(tipoDedicacion.getFechaModificacion());
        dto.setIniciales(tipoDedicacion.getIniciales());
        dto.setDescripcion(tipoDedicacion.getDescripcion());
        dto.setActivo(tipoDedicacion.getActivo());
        dto.setFechaCreacion(tipoDedicacion.getFechaCreacion());
        return dto;
    }

    public static TipoDedicacion toEntity(TipoDedicacionDto dto) {
        TipoDedicacion tipoDedicacion = new TipoDedicacion();
        tipoDedicacion.setId(dto.getId());
        tipoDedicacion.setFechaModificacion(dto.getFechaModificacion());
        tipoDedicacion.setIniciales(dto.getIniciales());
        tipoDedicacion.setDescripcion(dto.getDescripcion());
        tipoDedicacion.setActivo(dto.getActivo());
        tipoDedicacion.setFechaCreacion(dto.getFechaCreacion());

        return tipoDedicacion;
    }

}
