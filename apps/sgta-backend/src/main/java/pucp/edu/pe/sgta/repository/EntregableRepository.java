package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.Entregable;

import java.util.List;

@Repository
public interface EntregableRepository extends JpaRepository<Entregable, Integer> {

	@Query(value = "SELECT * FROM listar_entregables_x_etapa_formativa_x_ciclo(:etapaFormativaXCicloId)",
			nativeQuery = true)
	List<Object[]> listarEntregablesXEtapaFormativaXCiclo(
			@Param("etapaFormativaXCicloId") Integer etapaFormativaXCicloId);

}
