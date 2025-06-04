package pucp.edu.pe.sgta.repository;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import pucp.edu.pe.sgta.model.EntregableXTema;

public interface EntregableXTemaRepository extends CrudRepository<EntregableXTema, Long> {

    @Query("SELECT e FROM EntregableXTema e JOIN FETCH e.entregable WHERE e.tema.id = :temaId")
    List<EntregableXTema> findByTemaIdWithEntregable(Integer temaId);

    /**
     * Busca EntregableXTema no enviados para un entregable específico
     * Útil para saber qué estudiantes aún no han entregado
     */
    @Query("""
        SELECT ext FROM EntregableXTema ext
        JOIN FETCH ext.tema t
        JOIN FETCH ext.entregable e
        WHERE ext.entregable.id = :entregableId
          AND ext.activo = true
          AND (ext.estadoStr = 'no_enviado' OR ext.fechaEnvio IS NULL)
    """)
    List<EntregableXTema> findNoEnviadosByEntregableId(@Param("entregableId") Integer entregableId);

    /**
     * Busca EntregableXTema no enviados para un tema específico
     * y entregables que vencen en un rango de fechas
     */
    @Query("""
        SELECT ext FROM EntregableXTema ext
        JOIN FETCH ext.tema t
        JOIN FETCH ext.entregable e
        WHERE ext.tema.id = :temaId
          AND ext.activo = true
          AND (ext.estadoStr = 'no_enviado' OR ext.fechaEnvio IS NULL)
          AND ext.entregable.fechaFin BETWEEN :inicio AND :fin
    """)
    List<EntregableXTema> findNoEnviadosByTemaAndFechaFin(
            @Param("temaId") Integer temaId,
            @Param("inicio") OffsetDateTime inicio,
            @Param("fin") OffsetDateTime fin
    );

    /**
     * Busca EntregableXTema no enviados que ya han vencido
     */
    @Query("""
        SELECT ext FROM EntregableXTema ext
        JOIN FETCH ext.tema t
        JOIN FETCH ext.entregable e
        WHERE ext.activo = true
          AND (ext.estadoStr = 'no_enviado' OR ext.fechaEnvio IS NULL)
          AND ext.entregable.fechaFin < :ahora
    """)
    List<EntregableXTema> findNoEnviadosVencidos(@Param("ahora") OffsetDateTime ahora);

}
