package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query(value = "SELECT * FROM listar_reuniones_por_asesor(:asesorId)", nativeQuery = true)
    List<Object[]> listarReunionesXAsesor(@Param("asesorId") Integer asesorId);

    @Query(value = "SELECT * FROM listar_tesistas_por_reunion(:reunionId)", nativeQuery = true)
    List<Object[]> listarTesistasXReunion(@Param("reunionId") Integer reunionId);
}