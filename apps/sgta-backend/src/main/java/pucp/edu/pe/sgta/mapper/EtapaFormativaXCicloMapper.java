package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloDto;
import pucp.edu.pe.sgta.model.EtapaFormativaXCiclo;

public class EtapaFormativaXCicloMapper {

    public static EtapaFormativaXCicloDto toDto(EtapaFormativaXCiclo etapaFormativaXCiclo) {
        EtapaFormativaXCicloDto dto = new EtapaFormativaXCicloDto();
        dto.setId(etapaFormativaXCiclo.getId());
        return dto;
    }

    public static EtapaFormativaXCiclo toEntity(EtapaFormativaXCicloDto dto) {
        EtapaFormativaXCiclo etapaFormativaXCiclo = new EtapaFormativaXCiclo();
        etapaFormativaXCiclo.setId(dto.getId());

        return etapaFormativaXCiclo;
    }
}
