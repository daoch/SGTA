package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;

import pucp.edu.pe.sgta.model.RevisionCriterioExposicion;

import java.util.List;
import java.util.Optional;

public interface RevisionCriterioExposicionRepository extends JpaRepository<RevisionCriterioExposicion, Integer> {
        Optional<RevisionCriterioExposicion> findByExposicionXTema_IdAndCriterioExposicion_IdAndUsuario_Id(
                        Integer exposicionXTemaId,
                        Integer criterioExposicionId,
                        Integer usuarioId);

        List<RevisionCriterioExposicion> findByExposicionXTema_IdAndCriterioExposicion_Id(Integer exposicionXTemaId,
                        Integer criterioId);

        @Procedure(procedureName = "insertar_revision_criterio_exposicion_por_jurado_id_por_tema_id")
        void insertarRevisionCriterioExposicion(Integer p_tema_id, Integer p_miembro_jurado_id);
}
