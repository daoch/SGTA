package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.model.CriterioExposicionPreset;

import java.util.List;

public interface CriterioExposicionPresetService {

	List<CriterioExposicionPreset> getAllActivo();

	int create(CriterioExposicionPreset criterioExposicionPreset);

	void delete(Integer criterioExposicionPresetId);

}
