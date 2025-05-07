package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.AreaConocimientoDto;
import java.util.List;

public interface AreaConocimientoService {

	AreaConocimientoDto create(AreaConocimientoDto dto);

	void update(AreaConocimientoDto dto);

	void delete(Integer id);

	List<AreaConocimientoDto> getAll();

	List<AreaConocimientoDto> getAllByCarrera(Integer idCarrera);
    AreaConocimientoDto findById(Integer id);

    List<AreaConocimientoDto> listarPorUsuario(Integer usuarioId);

    List<InfoAreaConocimientoDto> listarInfoPorNombre(String nombre);
}
