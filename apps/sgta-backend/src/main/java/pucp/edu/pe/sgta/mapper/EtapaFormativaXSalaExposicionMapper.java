package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.EtapaFormativaXSalaExposicionDto;
import pucp.edu.pe.sgta.model.EtapaFormativa;
import pucp.edu.pe.sgta.model.EtapaFormativaXSalaExposicion;
import pucp.edu.pe.sgta.model.SalaExposicion;

public class EtapaFormativaXSalaExposicionMapper {

    public static EtapaFormativaXSalaExposicionDto toDto(EtapaFormativaXSalaExposicion etapaFormativaXSalaExposicion) {
        EtapaFormativaXSalaExposicionDto dto = new EtapaFormativaXSalaExposicionDto();
        dto.setId(etapaFormativaXSalaExposicion.getId());
        dto.setEtapaFormativaId(etapaFormativaXSalaExposicion.getEtapaFormativa().getId());
        dto.setSalaExposicionId(etapaFormativaXSalaExposicion.getSalaExposicion().getId());
        dto.setActivo(etapaFormativaXSalaExposicion.isActivo());
        dto.setFechaCreacion(etapaFormativaXSalaExposicion.getFechaCreacion());
        dto.setFechaModificacion(etapaFormativaXSalaExposicion.getFechaModificacion());
        return dto;
    }

    public static EtapaFormativaXSalaExposicion toEntity(EtapaFormativaXSalaExposicionDto dto) {
        EtapaFormativaXSalaExposicion etapaFormativaXSalaExposicion = new EtapaFormativaXSalaExposicion();

        etapaFormativaXSalaExposicion.setId(dto.getId());

        EtapaFormativa etapaFormativa = new EtapaFormativa();
        etapaFormativa.setId(dto.getEtapaFormativaId());
        etapaFormativaXSalaExposicion.setEtapaFormativa(etapaFormativa);

        SalaExposicion salaExposicion = new SalaExposicion();
        salaExposicion.setId(dto.getSalaExposicionId());
        etapaFormativaXSalaExposicion.setSalaExposicion(salaExposicion);

        etapaFormativaXSalaExposicion.setActivo(dto.isActivo());
        etapaFormativaXSalaExposicion.setFechaCreacion(dto.getFechaCreacion());
        etapaFormativaXSalaExposicion.setFechaModificacion(dto.getFechaModificacion());

        return etapaFormativaXSalaExposicion;
    }
}
