package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pucp.edu.pe.sgta.model.ExposicionXTema;

import java.util.List;

public interface ExposicionXTemaRepository extends JpaRepository<ExposicionXTema, Integer> {

	List<ExposicionXTema> findByTemaIdAndActivoTrue(Integer temaId);

}