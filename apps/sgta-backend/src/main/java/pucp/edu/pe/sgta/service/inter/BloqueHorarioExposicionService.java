package pucp.edu.pe.sgta.service.inter;

import java.util.List;

import pucp.edu.pe.sgta.dto.BloqueHorarioExposicionCreateDTO;
import pucp.edu.pe.sgta.dto.BloqueHorarioExposicionDto;

public interface BloqueHorarioExposicionService {
    List<BloqueHorarioExposicionDto> getAll();

    BloqueHorarioExposicionDto findById(Integer id);

    BloqueHorarioExposicionDto create(BloqueHorarioExposicionCreateDTO dto);

    void update(BloqueHorarioExposicionDto dto);

    void delete(Integer id);
}
