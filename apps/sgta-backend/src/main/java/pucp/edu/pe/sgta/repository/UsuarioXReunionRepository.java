package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.Reunion;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.model.UsuarioXReunion;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioXReunionRepository extends JpaRepository<UsuarioXReunion, Integer> {

    // Buscar relaciones activas
    List<UsuarioXReunion> findByActivoTrue();

    // Buscar por usuario y reunión
    Optional<UsuarioXReunion> findByUsuarioAndReunionAndActivoTrue(Usuario usuario, Reunion reunion);

    // Buscar reuniones de un usuario
    List<UsuarioXReunion> findByUsuarioAndActivoTrue(Usuario usuario);

    // Buscar reuniones de un usuario por ID
    List<UsuarioXReunion> findByUsuarioIdAndActivoTrue(Integer usuarioId);

    // Buscar usuarios de una reunión
    List<UsuarioXReunion> findByReunionAndActivoTrue(Reunion reunion);

    // Buscar usuarios de una reunión por ID
    List<UsuarioXReunion> findByReunionIdAndActivoTrue(Integer reunionId);

    // Buscar por estado de asistencia
    List<UsuarioXReunion> findByEstadoAsistenciaAndActivoTrue(String estadoAsistencia);

    // Buscar por usuario y estado de asistencia
    List<UsuarioXReunion> findByUsuarioAndEstadoAsistenciaAndActivoTrue(Usuario usuario, String estadoAsistencia);

    // Buscar por reunión y estado de asistencia
    List<UsuarioXReunion> findByReunionAndEstadoAsistenciaAndActivoTrue(Reunion reunion, String estadoAsistencia);

    // Contar participantes de una reunión
    Long countByReunionIdAndActivoTrue(Integer reunionId);

    // Contar participantes por estado de asistencia
    Long countByReunionIdAndEstadoAsistenciaAndActivoTrue(Integer reunionId, String estadoAsistencia);

    // Verificar si un usuario está registrado en una reunión
    boolean existsByUsuarioIdAndReunionIdAndActivoTrue(Integer usuarioId, Integer reunionId);

    // Solo mantenemos @Query para consultas complejas con fechas
    @Query("SELECT ur FROM UsuarioXReunion ur WHERE ur.usuario.id = :usuarioId AND ur.reunion.fechaHoraInicio > CURRENT_TIMESTAMP AND ur.activo = true ORDER BY ur.reunion.fechaHoraInicio ASC")
    List<UsuarioXReunion> findReunionesFuturasByUsuarioId(@Param("usuarioId") Integer usuarioId);

    @Query("SELECT ur FROM UsuarioXReunion ur WHERE ur.usuario.id = :usuarioId AND ur.reunion.fechaHoraFin < CURRENT_TIMESTAMP AND ur.activo = true ORDER BY ur.reunion.fechaHoraInicio DESC")
    List<UsuarioXReunion> findReunionesPasadasByUsuarioId(@Param("usuarioId") Integer usuarioId);

}