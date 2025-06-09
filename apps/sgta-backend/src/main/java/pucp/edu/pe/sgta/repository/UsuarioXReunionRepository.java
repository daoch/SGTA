package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.UsuarioXReunion;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioXReunionRepository extends JpaRepository<UsuarioXReunion, Integer> {

    // Listar todas las relaciones activas
    List<UsuarioXReunion> findByActivoTrue();

    // Listar reuniones de un usuario específico
    List<UsuarioXReunion> findByUsuarioIdAndActivoTrue(Integer usuarioId);

    // Listar usuarios de una reunión específica
    List<UsuarioXReunion> findByReunionIdAndActivoTrue(Integer reunionId);

    // Listar reuniones de un usuario ordenadas por fecha
    List<UsuarioXReunion> findByUsuarioIdAndActivoTrueOrderByReunionFechaHoraInicioDesc(Integer usuarioId);

    // Listar las reuniones por reunion ID
    List<UsuarioXReunion> findByReunionIdIn(Collection<Integer> reunionIds);

    Optional<UsuarioXReunion> findByIdAndActivoTrue(Integer id);
}