package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.TemaDto;
import java.util.List;

public interface TemaService {
    List<TemaDto> getAll();
    TemaDto findById(Integer id);
    List<TemaDto> findByUsuario(Integer idUsuario); //Works for asesor, alumno, coordinador and revisor
    void createTema(TemaDto dto, Integer idUsuario);
    void update(TemaDto dto);
    void delete(Integer id);
}
