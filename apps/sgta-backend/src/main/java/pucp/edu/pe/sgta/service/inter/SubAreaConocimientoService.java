package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.SubAreaConocimientoDto;
import java.util.List;

public interface SubAreaConocimientoService {

	List<SubAreaConocimientoDto> getAll();

	SubAreaConocimientoDto findById(Integer id);

	void create(SubAreaConocimientoDto dto);

	void update(SubAreaConocimientoDto dto);

	void delete(Integer id);

	List<SubAreaConocimientoDto> getAllByArea(Integer idArea);

}
