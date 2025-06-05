package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.ControlExposicionUsuarioTemaDto;
import java.util.List;

public interface ControlExposicionUsuarioTemaService {

    List<ControlExposicionUsuarioTemaDto> getAll();

    ControlExposicionUsuarioTemaDto findById(Integer id);

    void create(ControlExposicionUsuarioTemaDto dto);

    void update(ControlExposicionUsuarioTemaDto dto);

    void delete(Integer id);

    void updateEstadoRespuestaExposicion(Integer exposicionId, Integer temaId);

}
