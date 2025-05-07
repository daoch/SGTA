package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.EtapaFormativaDTO;
import java.util.List;

public interface EtapaFormativaService {

    List<EtapaFormativaDTO> getAll();

    EtapaFormativaDTO findById(Integer id);

    void create(EtapaFormativaDTO dto);

    void update(EtapaFormativaDTO dto);

    void delete(Integer id);

}
