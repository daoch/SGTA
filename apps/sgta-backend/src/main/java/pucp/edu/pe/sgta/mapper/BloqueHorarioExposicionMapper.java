package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.BloqueHorarioExposicionDto;
import pucp.edu.pe.sgta.model.BloqueHorarioExposicion;
import pucp.edu.pe.sgta.model.JornadaExposicionXSalaExposicion;

public class BloqueHorarioExposicionMapper {
    public static BloqueHorarioExposicionDto toDTO(BloqueHorarioExposicion bloqueHorarioExposicion) {
        BloqueHorarioExposicionDto dto = new BloqueHorarioExposicionDto();
        dto.setId(bloqueHorarioExposicion.getId());
        dto.setJornadaExposicionXSalaId(bloqueHorarioExposicion.getJornadaExposicionXSala().getId());
        dto.setDatetimeInicio(bloqueHorarioExposicion.getDatetimeInicio());
        dto.setDatetimeFin(bloqueHorarioExposicion.getDatetimeFin());
        dto.setFechaCreacion(bloqueHorarioExposicion.getFechaCreacion());
        dto.setFechaModificacion(bloqueHorarioExposicion.getFechaModificacion());
        dto.setActivo(bloqueHorarioExposicion.isActivo());
        dto.setEsBloqueBloqueado(bloqueHorarioExposicion.isEsBloqueBloqueado());
        dto.setEsBloqueReservado(bloqueHorarioExposicion.isEsBloqueReservado());

        return dto;
    }

    public static BloqueHorarioExposicion toEntity(BloqueHorarioExposicionDto dto) {
        BloqueHorarioExposicion bloqueHorarioExposicion = new BloqueHorarioExposicion();
        bloqueHorarioExposicion.setId(dto.getId());
        bloqueHorarioExposicion.setDatetimeInicio(dto.getDatetimeInicio());
        bloqueHorarioExposicion.setDatetimeFin(dto.getDatetimeFin());
        bloqueHorarioExposicion.setFechaCreacion(dto.getFechaCreacion());
        bloqueHorarioExposicion.setFechaModificacion(dto.getFechaModificacion());
        bloqueHorarioExposicion.setActivo(dto.isActivo());
        bloqueHorarioExposicion.setEsBloqueBloqueado(dto.isEsBloqueBloqueado());
        bloqueHorarioExposicion.setEsBloqueReservado(dto.isEsBloqueReservado());

        JornadaExposicionXSalaExposicion jornadaExposicionXSalaExposicion = new JornadaExposicionXSalaExposicion();
        jornadaExposicionXSalaExposicion.setId(dto.getJornadaExposicionXSalaId());
        bloqueHorarioExposicion.setJornadaExposicionXSala(jornadaExposicionXSalaExposicion);

        return bloqueHorarioExposicion;
    }
}
