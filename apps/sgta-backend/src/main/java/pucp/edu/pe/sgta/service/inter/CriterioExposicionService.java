package pucp.edu.pe.sgta.service.inter;

import java.util.List;

import pucp.edu.pe.sgta.dto.CriterioExposicionDto;

public interface CriterioExposicionService {
    List<CriterioExposicionDto> getAll();

    CriterioExposicionDto findById(Integer id);

    void create(CriterioExposicionDto dto);

    void update(CriterioExposicionDto dto);

    void delete(Integer id);
}
