package pucp.edu.pe.sgta.service.inter;

import java.util.List;

import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloDTO;

public interface EtapaFormativaXCicloService {
    List<EtapaFormativaXCicloDTO> getAll();

    EtapaFormativaXCicloDTO findById(Integer id);

    void create(EtapaFormativaXCicloDTO dto);

    void update(EtapaFormativaXCicloDTO dto);

    void delete(Integer id);
}
