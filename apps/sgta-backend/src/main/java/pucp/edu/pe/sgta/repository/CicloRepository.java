package pucp.edu.pe.sgta.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import pucp.edu.pe.sgta.model.Ciclo;

public interface CicloRepository extends JpaRepository<Ciclo, Integer> {

    @Query(value = """
            SELECT *
              FROM Ciclo
              ORDER BY activo DESC, fecha_inicio DESC
            """, nativeQuery = true)
    List<Ciclo> findAllOrderByActivoAndFechaInicioDesc();
}
