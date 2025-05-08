package pucp.edu.pe.sgta.service.inter;

import java.util.List;

import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloDto;

public interface EtapaFormativaXCicloService {
    List<EtapaFormativaXCicloDto> getAll();

    EtapaFormativaXCicloDto findById(Integer id);

    void create(EtapaFormativaXCicloDto dto);

    void update(EtapaFormativaXCicloDto dto);

    void delete(Integer id);
}
