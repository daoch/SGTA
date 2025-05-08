package pucp.edu.pe.sgta.service.inter;

import java.util.List;

import pucp.edu.pe.sgta.dto.JornadaExposicionDto;

public interface JornadaExposicionService {
    List<JornadaExposicionDto> getAll();

    JornadaExposicionDto findById(Integer id);

    void create(JornadaExposicionDto dto);

    void update(JornadaExposicionDto dto);

    void delete(Integer id);

}
