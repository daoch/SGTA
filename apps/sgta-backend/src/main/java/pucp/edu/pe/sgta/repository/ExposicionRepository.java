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
    List<Object[]> listarExposicionesXEtapaFormativaXCiclo(
            @Param("etapaFormativaXCicloId") Integer etapaFormativaXCicloId);

    @Query(value = """
            SELECT *
              FROM listar_exposicion_x_ciclo_actual_etapa_formativa(
                :etapa_formativa_id)
            """, nativeQuery = true)
    List<Object[]> listarExposicionXCicloActualEtapaFormativa(
            @Param("etapa_formativa_id") Integer etapaFormativaId);

    @Query(value = """
            SELECT *
              FROM listar_exposiciones_por_coordinador_v2(
                :coordinador_id)
            """, nativeQuery = true)
    List<Object[]> listarExposicionesInicializadasXCoordinador(@Param("coordinador_id") Integer coordinadorId);

    @Query(value = "SELECT * FROM listar_exposiciones_sin_inicializar_cicloactual_por_etapa_formativa(:etapaFormativaId)", nativeQuery = true)
    List<Object[]> listarExposicionesSinInicializarByEtapaFormativaEnCicloActual(
            @Param("etapaFormativaId") Integer etapaFormativaId);

    @Query(value = "SELECT * FROM obtener_exposiciones_por_usuario(:usuarioId)", nativeQuery = true)
    List<Object[]> obtener_exposiciones_por_usuario(
            @Param("usuarioId") Integer usuarioId);

    @Query(value = "SELECT * FROM listar_exposiciones_por_usuario(:usuarioId)", nativeQuery = true)
    List<Object[]> listarExposicionesXUsuario(@Param("usuarioId") Integer usuarioId);

    Integer countByEtapaFormativaXCicloIdAndActivoTrue(Integer etapaFormativaXCicloId);
}
