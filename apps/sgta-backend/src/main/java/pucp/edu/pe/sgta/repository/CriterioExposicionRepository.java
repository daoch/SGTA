package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.CriterioExposicion;

import java.util.List;

@Repository
public interface CriterioExposicionRepository extends JpaRepository<CriterioExposicion, Integer> {

    @Query(value = "SELECT * FROM listar_criterios_exposicion_x_exposicion(:exposicionId)", nativeQuery = true)
    List<Object[]> listarCriteriosExposicionXExposicion(@Param("exposicionId") Integer exposicionId);

    List<CriterioExposicion> findByExposicion_IdAndActivoTrue(Integer exposicionId);

    @Query(value = "SELECT asociar_temas_a_criterio_exposicion(:criterioExposicionId, :exposicionId)", nativeQuery = true)
    void asociarTemasACriterioExposicion(@Param("criterioExposicionId") Integer criterioExposicionId, @Param("exposicionId") Integer exposicionId);
}
