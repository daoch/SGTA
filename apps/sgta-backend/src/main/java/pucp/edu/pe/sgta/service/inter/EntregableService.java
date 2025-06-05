package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.EntregableAlumnoDto;
import pucp.edu.pe.sgta.dto.EntregableDto;
import pucp.edu.pe.sgta.dto.EntregableSubidoDto;
import pucp.edu.pe.sgta.dto.EntregableXTemaDto;

import java.util.List;

public interface EntregableService {
    List<EntregableDto> listarEntregablesXEtapaFormativaXCiclo(Integer etapaFormativaXCicloId);
    List<EntregableXTemaDto> listarEntregablesConEnvioXEtapaFormativaXCiclo(Integer etapaFormativaXCicloId, Integer temaId);
    Integer create(Integer etapaFormativaXCicloId, EntregableDto entregableDto);
    List<EntregableDto> getAll(); // Obtiene la lista de entregables
    void update(EntregableDto entregableDto); // Actualiza un entregable
    void delete(Integer entregableId); // Elimina un entregable
    EntregableDto findById(Integer id);
    List<EntregableAlumnoDto> listarEntregablesPorAlumno(String alumnoId);
    void entregarEntregable(Integer entregableId, EntregableSubidoDto entregableDto);
}
