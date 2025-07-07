package pucp.edu.pe.sgta.service.inter;

import java.util.List;

import pucp.edu.pe.sgta.dto.CriterioExposicionDto;

public interface CriterioExposicionService {
    List<CriterioExposicionDto> getAll();

    List<CriterioExposicionDto> listarCriteriosExposicionXExposicion(Integer exposicionId);

    CriterioExposicionDto findById(Integer id);

    Integer create(Integer criterioExposicionId,CriterioExposicionDto dto, String cognitoId);

    void update(CriterioExposicionDto dto, String cognitoId);

    void delete(Integer id, String cognitoId);
}
