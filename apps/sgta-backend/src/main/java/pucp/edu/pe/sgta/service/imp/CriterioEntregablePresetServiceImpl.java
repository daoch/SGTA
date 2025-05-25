package pucp.edu.pe.sgta.service.imp;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.model.CriterioEntregablePreset;
import pucp.edu.pe.sgta.repository.CriterioEntregablePresetRepository;
import pucp.edu.pe.sgta.service.inter.CriterioEntregablePresetService;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class CriterioEntregablePresetServiceImpl implements CriterioEntregablePresetService {

	private final CriterioEntregablePresetRepository criterioEntregablePresetRepository;

	public CriterioEntregablePresetServiceImpl(CriterioEntregablePresetRepository criterioEntregablePresetRepository) {
		this.criterioEntregablePresetRepository = criterioEntregablePresetRepository;
	}

	@Override
	public List<CriterioEntregablePreset> getAllActivo() {
		return criterioEntregablePresetRepository.findByActivoTrue();
	}

	@Transactional
	@Override
	public int create(CriterioEntregablePreset criterioEntregablePreset) {
		criterioEntregablePreset.setId(null);
		criterioEntregablePreset.setFechaCreacion(OffsetDateTime.now());
		criterioEntregablePresetRepository.save(criterioEntregablePreset);
		return criterioEntregablePreset.getId();
	}

	@Transactional
	@Override
	public void delete(Integer criterioEntregablePresetId) {
		CriterioEntregablePreset criterioEntregablePresetToDelete = criterioEntregablePresetRepository
			.findById(criterioEntregablePresetId)
			.orElseThrow(() -> new RuntimeException(
					"CriterioEntregablePreset no encontrado con ID: " + criterioEntregablePresetId));
		criterioEntregablePresetToDelete.setActivo(false);
		criterioEntregablePresetToDelete.setFechaModificacion(OffsetDateTime.now());
		criterioEntregablePresetRepository.save(criterioEntregablePresetToDelete);
	}

}
