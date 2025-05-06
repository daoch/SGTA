package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.EntregableDto;
import pucp.edu.pe.sgta.model.Entregable;

import java.util.List;

public interface EntregableService {
    List<EntregableDto> listarEntregablesXEtapaFormativaXCiclo(Integer etapaFormativaXCicloId);
    int crearEntregable(Integer etapaFormativaXCicloId, EntregableDto entregableDto);
    List<EntregableDto> getAll(); // Obtiene la lista de entregables
    void update(EntregableDto entregableDto); // Actualiza un entregable
    void delete(EntregableDto entregableDto); // Elimina un entregable
    Entregable findById(int id);
}
