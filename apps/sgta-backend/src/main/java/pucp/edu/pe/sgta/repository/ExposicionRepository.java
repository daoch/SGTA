package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.Exposicion;

import java.util.List;

@Repository
public interface ExposicionRepository extends JpaRepository<Exposicion, Integer> {

    @Query(value = "SELECT * FROM listar_exposiciones_x_etapa_formativa_x_ciclo(:etapaFormativaXCicloId)", nativeQuery = true)
    List<Object[]> listarExposicionesXEtapaFormativaXCiclo(@Param("etapaFormativaXCicloId") Integer etapaFormativaXCicloId);

}
