package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.CriterioEntregablePreset;

import java.util.List;

@Repository
public interface CriterioEntregablePresetRepository extends JpaRepository<CriterioEntregablePreset, Integer> {

	List<CriterioEntregablePreset> findByActivoTrue();

}
