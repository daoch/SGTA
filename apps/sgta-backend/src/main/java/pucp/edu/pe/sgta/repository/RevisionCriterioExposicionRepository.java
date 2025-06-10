package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pucp.edu.pe.sgta.model.RevisionCriterioExposicion;

import java.util.List;
import java.util.Optional;

public interface RevisionCriterioExposicionRepository extends JpaRepository<RevisionCriterioExposicion, Integer> {
    Optional<RevisionCriterioExposicion> findByExposicionXTema_IdAndCriterioExposicion_IdAndUsuario_Id(
            Integer exposicionXTemaId,
            Integer criterioExposicionId,
            Integer usuarioId
    );
    List<RevisionCriterioExposicion> findByExposicionXTema_IdAndCriterioExposicion_Id(Integer exposicionXTemaId, Integer criterioId);

}
