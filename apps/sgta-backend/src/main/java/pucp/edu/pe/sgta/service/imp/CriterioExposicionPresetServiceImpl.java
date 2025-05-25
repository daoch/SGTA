package pucp.edu.pe.sgta.service.imp;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.model.CriterioExposicionPreset;
import pucp.edu.pe.sgta.repository.CriterioExposicionPresetRepository;
import pucp.edu.pe.sgta.service.inter.CriterioExposicionPresetService;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class CriterioExposicionPresetServiceImpl implements CriterioExposicionPresetService {

	private final CriterioExposicionPresetRepository criterioExposicionPresetRepository;

	public CriterioExposicionPresetServiceImpl(CriterioExposicionPresetRepository criterioExposicionPresetRepository) {
		this.criterioExposicionPresetRepository = criterioExposicionPresetRepository;
	}

	@Override
	public List<CriterioExposicionPreset> getAllActivo() {
		return criterioExposicionPresetRepository.findByActivoTrue();
	}

	@Transactional
	@Override
	public int create(CriterioExposicionPreset criterioExposicionPreset) {
		criterioExposicionPreset.setId(null);
		criterioExposicionPreset.setFechaCreacion(OffsetDateTime.now());
		criterioExposicionPresetRepository.save(criterioExposicionPreset);
		return criterioExposicionPreset.getId();
	}

	@Transactional
	@Override
	public void delete(Integer criterioExposicionPresetId) {
		CriterioExposicionPreset criterioExposicionPresetToDelete = criterioExposicionPresetRepository
			.findById(criterioExposicionPresetId)
			.orElseThrow(() -> new RuntimeException(
					"CriterioExposicionPreset no encontrado con ID: " + criterioExposicionPresetId));
		criterioExposicionPresetToDelete.setActivo(false);
		criterioExposicionPresetToDelete.setFechaModificacion(OffsetDateTime.now());
		criterioExposicionPresetRepository.save(criterioExposicionPresetToDelete);
	}

}
