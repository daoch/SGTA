package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import pucp.edu.pe.sgta.model.JornadaExposicion;

import java.util.List;

public interface JornadaExposicionRepository extends JpaRepository<JornadaExposicion, Integer> {

	List<JornadaExposicion> findByExposicionIdAndActivoTrue(Integer exposicionId);

}
