package pucp.edu.pe.sgta.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import pucp.edu.pe.sgta.dto.CicloConEtapasDTO;
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
  List<CicloConEtapasDTO> findAllCiclesAndEtapaFormativas();

}
