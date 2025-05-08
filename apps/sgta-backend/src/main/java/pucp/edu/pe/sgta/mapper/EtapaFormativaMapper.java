package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.EtapaFormativaDTO;
import pucp.edu.pe.sgta.model.Carrera;
import pucp.edu.pe.sgta.model.EtapaFormativa;

public class EtapaFormativaMapper {

    public static EtapaFormativaDTO toDto(EtapaFormativa etapaFormativa) {
        EtapaFormativaDTO dto = new EtapaFormativaDTO();
        dto.setId(etapaFormativa.getId());
        dto.setNombre(etapaFormativa.getNombre());
        dto.setCreditajePorTema(etapaFormativa.getCreditajePorTema());
        dto.setDuracionExposicion(etapaFormativa.getDuracionExposicion());
        dto.setActivo(etapaFormativa.getActivo());
        dto.setFechaCreacion(etapaFormativa.getFechaCreacion());
        dto.setFechaModificacion(etapaFormativa.getFechaModificacion());
        dto.setCarreraId(etapaFormativa.getCarrera().getId());
        return dto;
    }

    public static EtapaFormativa toEntity(EtapaFormativaDTO dto) {
        EtapaFormativa etapaFormativa = new EtapaFormativa();
        etapaFormativa.setId(dto.getId());
        etapaFormativa.setNombre(dto.getNombre());
        etapaFormativa.setCreditajePorTema(dto.getCreditajePorTema());
        etapaFormativa.setDuracionExposicion(dto.getDuracionExposicion());
        etapaFormativa.setActivo(dto.getActivo());
        etapaFormativa.setFechaCreacion(dto.getFechaCreacion());
        etapaFormativa.setFechaModificacion(dto.getFechaModificacion());
        Carrera carrera = new Carrera();
        carrera.setId(dto.getCarreraId());
        etapaFormativa.setCarrera(carrera);
        return etapaFormativa;
    }
}
