package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.EtapaFormativaDto;
import java.util.List;

public interface EtapaFormativaService {

    List<EtapaFormativaDto> getAll();

    EtapaFormativaDto findById(Integer id);

    void create(EtapaFormativaDto dto);

    void update(EtapaFormativaDto dto);

    void delete(Integer id);

}
