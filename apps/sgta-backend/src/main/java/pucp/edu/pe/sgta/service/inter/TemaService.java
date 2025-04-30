package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.TemaDto;
import java.util.List;

public interface TemaService {
    List<TemaDto> listarTodos();
    TemaDto buscarPorId(Integer id);
    TemaDto crear(TemaDto dto);
    TemaDto actualizar(Integer id, TemaDto dto);
    void eliminar(Integer id);
}
