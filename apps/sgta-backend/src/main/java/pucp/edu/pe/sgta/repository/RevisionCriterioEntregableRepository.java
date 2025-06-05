package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.RevisionCriterioEntregable;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface RevisionCriterioEntregableRepository
        extends JpaRepository<RevisionCriterioEntregable, Integer> {

    /**
     * Devuelve la nota (BigDecimal) para la combinación (entregableXTemaId, criterioEntregableId),
     * únicamente si r.activo = true.
     */
    @Query("""
        SELECT r.nota
        FROM RevisionCriterioEntregable r
        WHERE r.entregableXTema.entregableXTemaId = :etId
          AND r.criterioEntregable.id = :critId
          AND r.activo = true
    """)
    Optional<BigDecimal> findNotaByEntregableXTemaIdAndCriterioEntregableId(
        @Param("etId") Integer entregableXTemaId,
        @Param("critId") Integer criterioEntregableId
    );
}
