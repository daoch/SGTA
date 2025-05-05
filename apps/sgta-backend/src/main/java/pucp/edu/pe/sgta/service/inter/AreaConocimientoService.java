package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.AreaConocimientoDto;

import java.util.List;

public interface AreaConocimientoService {

    AreaConocimientoDto findById(Integer id);

    List<AreaConocimientoDto> listarPorUsuario(Integer usuarioId);

}
