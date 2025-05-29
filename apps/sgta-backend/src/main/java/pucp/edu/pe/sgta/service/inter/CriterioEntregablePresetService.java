package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.model.CriterioEntregablePreset;

import java.util.List;

public interface CriterioEntregablePresetService {
    List<CriterioEntregablePreset> getAllActivo();
    int create(CriterioEntregablePreset criterioEntregablePreset);
    void delete(Integer criterioEntregablePresetId);
}
