package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import pucp.edu.pe.sgta.model.BloqueHorarioExposicion;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BloqueHorarioExposicionRepository extends JpaRepository<BloqueHorarioExposicion, Integer> {

    @Query(value = "SELECT * FROM listar_bloques_horario_por_exposicion(:exposicionId)", nativeQuery = true)
    List<Object[]> listarBloquesHorarioPorExposicion(@Param("exposicionId") Integer exposicionId);
}
