package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.HistorialTemaDto;

import java.util.List;

public interface HistorialTemaService {

	public HistorialTemaDto findById(Integer id);

	public List<HistorialTemaDto> findByTemaId(Integer id);

	public void save(HistorialTemaDto historialTemaDto);

}
