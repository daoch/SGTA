package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.JornadaExposicionDto;
import pucp.edu.pe.sgta.model.Exposicion;
import pucp.edu.pe.sgta.model.JornadaExposicion;

public class JornadaExposicionMapper {
    public static JornadaExposicionDto toDto(JornadaExposicion jornadaExposicion) {
        JornadaExposicionDto dto = new JornadaExposicionDto();
        dto.setId(jornadaExposicion.getId());
        dto.setDatetimeInicio(jornadaExposicion.getDatetimeInicio());
        dto.setDatetimeFin(jornadaExposicion.getDatetimeFin());
        dto.setFechaCreacion(jornadaExposicion.getFechaCreacion());
        dto.setFechaModificacion(jornadaExposicion.getFechaModificacion());
        dto.setActivo(jornadaExposicion.getActivo());
        dto.setExposicionId(jornadaExposicion.getExposicion().getId());
        return dto;
    }

    public static JornadaExposicion toEntity(JornadaExposicionDto dto) {
        JornadaExposicion jornadaExposicion = new JornadaExposicion();
        jornadaExposicion.setId(dto.getId());

        Exposicion exposicion = new Exposicion();
        exposicion.setId(dto.getExposicionId());
        jornadaExposicion.setExposicion(exposicion);

        jornadaExposicion.setDatetimeInicio(dto.getDatetimeInicio());
        jornadaExposicion.setDatetimeFin(dto.getDatetimeFin());
        jornadaExposicion.setFechaCreacion(dto.getFechaCreacion());
        jornadaExposicion.setFechaModificacion(dto.getFechaModificacion());
        jornadaExposicion.setActivo(dto.getActivo());
        return jornadaExposicion;
    }
}
