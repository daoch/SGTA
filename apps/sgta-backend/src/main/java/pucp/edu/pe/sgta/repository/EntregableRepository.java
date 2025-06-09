package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.Entregable;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface EntregableRepository extends JpaRepository<Entregable, Integer> {

    @Query(value = "SELECT * FROM listar_entregables_x_etapa_formativa_x_ciclo(:etapaFormativaXCicloId)", nativeQuery = true)
    List<Object[]> listarEntregablesXEtapaFormativaXCiclo(@Param("etapaFormativaXCicloId") Integer etapaFormativaXCicloId);

    @Query(value = "SELECT * FROM listar_entregables_por_usuario(:usuarioId)", nativeQuery = true)
    List<Object[]> listarEntregablesXUsuario(@Param("usuarioId") Integer usuarioId);
    
    @Query(value = "SELECT * FROM listar_entregables_con_envio_x_etapa_formativa_x_ciclo(:etapaFormativaXCicloId, :temaId)",
            nativeQuery = true
    )
    List<Object[]> listarEntregablesConEnvioXEtapaFormativaXCiclo(
        @Param("etapaFormativaXCicloId") Integer etapaFormativaXCicloId,
        @Param("temaId") Integer temaId
    );

    @Query(value = "SELECT * FROM obtener_entregables_alumno(:alumnoId)", nativeQuery = true)
    List<Object[]> listarEntregablesPorAlumno(@Param("alumnoId") Integer alumnoId);

    @Query(value = "SELECT entregar_entregable(:entregableXTemaId, :comentario, :estado)", nativeQuery = true)
    void entregarEntregable(@Param("entregableXTemaId") Integer entregableXTemaId,
                            @Param("comentario") String comentario,
                            @Param("estado") String estado);

    /**
     * Busca entregables cuya fecha de fin esté dentro del rango especificado
     * para generar recordatorios automáticos
     */
    @Query("""
        SELECT e FROM Entregable e
        WHERE e.fechaFin BETWEEN :inicio AND :fin
          AND e.activo = true
    """)
    List<Entregable> findByFechaFinBetween(
            @Param("inicio") OffsetDateTime inicio,
            @Param("fin") OffsetDateTime fin
    );

    /**
     * Busca entregables que ya han vencido (fecha fin pasada)
     * para generar alertas de retraso
     */
    @Query("""
        SELECT e FROM Entregable e
        WHERE e.fechaFin < :ahora
          AND e.activo = true
    """)
    List<Entregable> findVencidos(@Param("ahora") OffsetDateTime ahora);

    Integer countByEtapaFormativaXCicloIdAndActivoTrue(Integer etapaFormativaXCicloId);

}
