package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pucp.edu.pe.sgta.model.JornadaExposicionXSalaExposicion;

import java.util.List;

public interface JornadaExposicionXSalaExposicionRepository
    extends JpaRepository<JornadaExposicionXSalaExposicion, Integer> {

  @Query(value = """
      SELECT *
        FROM listar_jornadas_exposicion_salas(
          :exposicion_id)
      """, nativeQuery = true)
  List<Object[]> listarJornadasExposicionSalas(
      @Param("exposicion_id") Integer exposicionId);

  List<JornadaExposicionXSalaExposicion> findByJornadaExposicionIdAndActivoTrue(Integer jornadaExposicionId);

  List<JornadaExposicionXSalaExposicion> findByJornadaExposicionId(Integer jornadaExposicionId);

  JornadaExposicionXSalaExposicion findJornadaExposicionXSalaExposicionByJornadaExposicionIdAndSalaExposicionIdAndActivoTrue(
      Integer jornadaExposicionId, Integer salaExposicionId);
}
