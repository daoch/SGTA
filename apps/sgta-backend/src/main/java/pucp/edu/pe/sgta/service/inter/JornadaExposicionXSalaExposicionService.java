package pucp.edu.pe.sgta.service.inter;

import java.util.List;

import pucp.edu.pe.sgta.dto.JornadaExposicionXSalaExposicionCreateDTO;
import pucp.edu.pe.sgta.dto.JornadaExposicionXSalaExposicionDto;

public interface JornadaExposicionXSalaExposicionService {
    List<JornadaExposicionXSalaExposicionDto> getAll();

    JornadaExposicionXSalaExposicionDto findById(Integer id);

    JornadaExposicionXSalaExposicionDto create(JornadaExposicionXSalaExposicionCreateDTO dto);

    void update(JornadaExposicionXSalaExposicionDto dto);

    void delete(Integer id);
}
