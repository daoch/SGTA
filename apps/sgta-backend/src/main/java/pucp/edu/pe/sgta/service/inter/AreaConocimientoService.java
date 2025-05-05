package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.AreaConocimientoDto;
import java.util.List;

public interface AreaConocimientoService {

	List<AreaConocimientoDto> getAll();

	void create(AreaConocimientoDto dto);

	void update(AreaConocimientoDto dto);

	void delete(Integer id);

    List<AreaConocimientoDto> getAllByCarrera(Integer idCarrera);

}
