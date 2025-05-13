package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pucp.edu.pe.sgta.model.CriterioEntregable;
import pucp.edu.pe.sgta.model.EstadoPlanificacion;

import java.util.List;

public interface EstadoPlanificacionRepository extends JpaRepository<EstadoPlanificacion, Integer> {

    @Query(value = "SELECT * FROM get_estado_exposicion_by_id_exposicion(:id_exposicion)", nativeQuery = true)
    List<Object[]>  getByIdExposicion(@Param("id_exposicion") Integer exposicionId);
}
