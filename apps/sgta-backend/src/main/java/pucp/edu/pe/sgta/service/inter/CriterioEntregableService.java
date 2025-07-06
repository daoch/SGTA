package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.CriterioEntregableDto;
import pucp.edu.pe.sgta.dto.RevisionCriterioEntregableDto;
import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.model.CriterioEntregable;

import java.util.List;
import java.util.Optional;

public interface CriterioEntregableService {
    List<CriterioEntregableDto> listarCriteriosEntregableXEntregable(Integer entregableId);
    int crearCriterioEntregable(Integer entregableId, CriterioEntregableDto criterioEntregableDto);
    void update(CriterioEntregableDto criterioEntregableDto);
    void delete(Integer criterioEntregableId);
    Optional<CriterioEntregable> findById(Integer id);
    List<CriterioEntregableDto> listar_criterio_entregable_x_revisionID(Integer revision_entregable_id);
    void insertar_actualizar_revision_criterio_entregable(CriterioEntregableDto criterioEntregable);
    List<RevisionCriterioEntregableDto> listarRevisionCriterioPorEntregableXTema(Integer entregableXTemaId);

}
