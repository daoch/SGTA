package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.SalaExposicionDto;

import java.util.List;

public interface SalaExposicionService {

	List<SalaExposicionDto> getAll();

	SalaExposicionDto findById(Integer id);

	void create(SalaExposicionDto dto);

	void update(SalaExposicionDto dto);

	void delete(Integer id);

}
