package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.RevisionCriterioExposicionDto;
import java.util.List;

public interface RevisionCriterioExposicionService {

    List<RevisionCriterioExposicionDto> getAll();

    RevisionCriterioExposicionDto findById(Integer id);

    void create(RevisionCriterioExposicionDto dto);

    void update(RevisionCriterioExposicionDto dto);

    void delete(Integer id);

}
