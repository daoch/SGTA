package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.RevisionCriterioEntregable;

import java.util.Optional;

@Repository
public interface RevisionCriterioEntregableRepository extends JpaRepository<RevisionCriterioEntregable, Long> {

    @Query("SELECT r.nota FROM RevisionCriterioEntregable r WHERE r.entregableXTema.id = :entregableXTemaId AND r.activo = true")
    Optional<Double> findNotaByEntregableXTemaId(Integer entregableXTemaId);
}
