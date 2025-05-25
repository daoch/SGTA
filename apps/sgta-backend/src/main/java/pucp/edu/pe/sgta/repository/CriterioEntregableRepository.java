package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.CriterioEntregable;

import java.util.List;

@Repository
public interface CriterioEntregableRepository extends JpaRepository<CriterioEntregable, Integer> {

	@Query(value = "SELECT * FROM listar_criterios_entregable_x_entregable(:entregableId)", nativeQuery = true)
	List<Object[]> listarCriteriosEntregableXEntregable(@Param("entregableId") Integer entregableId);

	CriterioEntregable findById(int id);

}