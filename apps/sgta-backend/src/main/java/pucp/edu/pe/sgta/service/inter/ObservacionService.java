package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.ObservacionesRevisionDTO;

import java.util.List;

public interface ObservacionService {
    List<ObservacionesRevisionDTO> obtenerObservacionesPorEntregableYTema(Integer entregableId, Integer temaId);
}