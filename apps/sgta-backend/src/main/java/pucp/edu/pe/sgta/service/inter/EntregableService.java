package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.EntregableDto;

import java.util.List;

public interface EntregableService {

	List<EntregableDto> listarEntregablesXEtapaFormativaXCiclo(Integer etapaFormativaXCicloId);

	Integer create(Integer etapaFormativaXCicloId, EntregableDto entregableDto);

	List<EntregableDto> getAll(); // Obtiene la lista de entregables

	void update(EntregableDto entregableDto); // Actualiza un entregable

	void delete(Integer entregableId); // Elimina un entregable

	EntregableDto findById(Integer id);

}
