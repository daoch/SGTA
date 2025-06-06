package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.ExposicionXTemaDto;
import java.util.List;

public interface ExposicionXTemaService {

    List<ExposicionXTemaDto> getAll();

    ExposicionXTemaDto findById(Integer id);

    void create(ExposicionXTemaDto dto);

    void update(ExposicionXTemaDto dto);

    void delete(Integer id);

    void createAllRelatedByExposicionId(Integer exposicionId);

}
