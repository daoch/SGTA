package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import pucp.edu.pe.sgta.model.BloqueHorarioExposicion;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;

public interface BloqueHorarioExposicionRepository extends JpaRepository<BloqueHorarioExposicion, Integer> {

    @Query(value = "SELECT * FROM listar_bloques_horario_por_exposicion(:exposicionId)", nativeQuery = true)
    List<Object[]> listarBloquesHorarioPorExposicion(@Param("exposicionId") Integer exposicionId);

    @Query(value = "SELECT actualizar_exposicon_tema_bloque_exposicion(CAST(:bloques_json AS jsonb))", nativeQuery = true)
    void actualizarMasivo(@Param("bloques_json") String bloquesJson);

    @Query(value = "SELECT actualizar_bloque_exposicion_siguientes_fases(CAST(:bloques_json AS jsonb))", nativeQuery = true)
    void updateBloquesExposicionNextPhase(@Param("bloques_json") String bloquesJson);

    @Query(value = "SELECT terminar_planificacion(:idExposicion)", nativeQuery = true)
    Boolean finishPlanning(@Param("idExposicion") Integer exposicionId);

    List<BloqueHorarioExposicion> findByExposicionXTemaIdAndActivoTrue(Integer exposicionXTemaId);

    @Query(value = "SELECT sala_ocupada_en_rango(:salaId, :inicio, :fin)", nativeQuery = true)
    Boolean verificarSalaOcupada(
            @Param("salaId") Integer salaId,
            @Param("inicio") OffsetDateTime inicio,
            @Param("fin") OffsetDateTime fin);

    @Query(value = "SELECT * FROM listar_bloques_con_temas_y_usuarios(:exposicionId)", nativeQuery = true)
    List<Object[]> listarBloquesHorarioPorExposicionConUsuariosYRespuesta(@Param("exposicionId") Integer exposicionId);

    @Query("SELECT b FROM BloqueHorarioExposicion b JOIN FETCH b.exposicionXTema WHERE b.jornadaExposicionXSala.id = :salaId")
    List<BloqueHorarioExposicion> findByJornadaExposicionXSalaId(@Param("salaId") Long salaId);

    List<BloqueHorarioExposicion> findByJornadaExposicionXSalaIdAndExposicionXTemaIsNotNull(
            Integer jornadaExposicionXSalaId);

    @Query(value = "SELECT actualizar_bloque_cambiados(CAST(:bloques_json AS jsonb))", nativeQuery = true)
    String updateBloquesCambidos(@Param("bloques_json") String bloquesJson);

}
