package pucp.edu.pe.sgta.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import pucp.edu.pe.sgta.dto.CicloConEtapasProjection;
import pucp.edu.pe.sgta.model.Ciclo;

public interface CicloRepository extends JpaRepository<Ciclo, Integer> {

  @Query(value = """
      SELECT *
        FROM listarCiclosOrdenadosPorFecha()
      """, nativeQuery = true)
  List<Ciclo> findAllOrderByActivoAndFechaInicioDesc();

  @Query(value = """
      SELECT *
        FROM listarCiclosConEtapas()
      """, nativeQuery = true)
  List<CicloConEtapasProjection> findAllCiclesAndEtapaFormativas();

  /**
   * Obtiene todos los ciclos (activos e inactivos) ordenados por año y semestre descendente
   */
  @Query("SELECT c FROM Ciclo c ORDER BY c.anio DESC, c.semestre DESC, c.activo DESC")
  List<Ciclo> findAllCiclosCompletos();

}
