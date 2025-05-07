package pucp.edu.pe.sgta.service.inter;

import java.util.List;

import pucp.edu.pe.sgta.dto.BloqueHorarioExposicionDto;

public interface BloqueHorarioExposicionService {
    List<BloqueHorarioExposicionDto> getAll();

    BloqueHorarioExposicionDto findById(Integer id);

    void create(BloqueHorarioExposicionDto dto);

    void update(BloqueHorarioExposicionDto dto);

    void delete(Integer id);
}
