package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.EntregableDto;

import java.util.List;

public interface EntregableService {
//    List<EntregableDto> findByEtapaFormativa(Integer idEtapaFormativa);
//    EntregableDto findById(Integer idEntregable);
    List<EntregableDto> getAll(); // Obtiene la lista de entregables
}
