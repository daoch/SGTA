package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.CriterioEntregableDto;
import pucp.edu.pe.sgta.model.CriterioEntregable;

import java.util.List;

public interface CriterioEntregableService {
    List<CriterioEntregableDto> listarCriteriosEntregableXEntregable(Integer entregableId);
    int crearCriterioEntregable(Integer entregableId, CriterioEntregableDto criterioEntregableDto);
    void update(CriterioEntregableDto criterioEntregableDto);
    void delete(CriterioEntregableDto criterioEntregableDto);
    CriterioEntregable findById(int id);
}
