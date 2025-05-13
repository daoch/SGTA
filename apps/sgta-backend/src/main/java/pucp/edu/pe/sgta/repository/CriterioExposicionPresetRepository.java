package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.CriterioExposicionPreset;

import java.util.List;

@Repository
public interface CriterioExposicionPresetRepository extends JpaRepository<CriterioExposicionPreset, Integer> {
    List<CriterioExposicionPreset> findByActivoTrue();
}
