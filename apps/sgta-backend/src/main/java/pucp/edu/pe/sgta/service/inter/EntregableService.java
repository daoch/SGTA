package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.EntregableAlumnoDto;
import pucp.edu.pe.sgta.dto.EntregableDto;
import pucp.edu.pe.sgta.dto.EntregableSubidoDto;
import pucp.edu.pe.sgta.dto.EntregableXTemaDto;

import java.util.List;

public interface EntregableService {
    List<EntregableDto> listarEntregablesXEtapaFormativaXCiclo(Integer etapaFormativaXCicloId);
    List<EntregableXTemaDto> listarEntregablesConEnvioXEtapaFormativaXCiclo(Integer etapaFormativaXCicloId, Integer temaId);
    Integer create(Integer etapaFormativaXCicloId, EntregableDto entregableDto, String cognitoId); // Crea un nuevo entregable
    List<EntregableDto> getAll(); // Obtiene la lista de entregables
    void update(EntregableDto entregableDto, String cognitoId); // Actualiza un entregable
    void delete(Integer entregableId, String cognitoId); // Elimina un entregable
    EntregableDto findById(Integer id);
    List<EntregableAlumnoDto> listarEntregablesPorAlumno(String alumnoId);
    EntregableAlumnoDto obtenerDetalleXTema(Integer entregableId, Integer temaId);
}
