package pucp.edu.pe.sgta.service.inter;

import java.util.List;

import pucp.edu.pe.sgta.dto.JornadaExposicionXSalaExposicionDto;

public interface JornadaExposicionXSalaExposicionService {
    List<JornadaExposicionXSalaExposicionDto> getAll();

    JornadaExposicionXSalaExposicionDto findById(Integer id);

    void create(JornadaExposicionXSalaExposicionDto dto);

    void update(JornadaExposicionXSalaExposicionDto dto);

    void delete(Integer id);
}
