package pucp.edu.pe.sgta.repository;

import pucp.edu.pe.sgta.model.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Integer> {

    /**
     * Verifica si ya existe una notificación del mismo tipo para el usuario hoy
     * para evitar duplicados en el mismo día
     */
    @Query("""
        SELECT CASE WHEN COUNT(n) > 0 THEN true ELSE false END
        FROM Notificacion n
        WHERE n.usuario.id = :usuarioId
          AND n.modulo.id = :moduloId
          AND n.tipoNotificacion.id = :tipoNotificacionId
          AND n.activo = true
          AND DATE(n.fechaCreacion) = DATE(:fecha)
    """)
    boolean existsByUsuarioModuloTipoFecha(
            @Param("usuarioId") Integer usuarioId,
            @Param("moduloId") Integer moduloId,
            @Param("tipoNotificacionId") Integer tipoNotificacionId,
            @Param("fecha") OffsetDateTime fecha
    );

    @Query("""
        SELECT CASE WHEN COUNT(n) > 0 THEN true ELSE false END
        FROM Notificacion n
        WHERE n.usuario.id = :usuarioId
          AND n.modulo.id = :moduloId
          AND n.tipoNotificacion.id = :tipoNotificacionId
          AND n.activo = true
          AND DATE(n.fechaCreacion) = DATE(:fecha)
          AND n.mensaje = :mensaje
    """)
    boolean existsByUsuarioModuloEventoTipoFecha(
            @Param("usuarioId") Integer usuarioId,
            @Param("moduloId") Integer moduloId,
            @Param("tipoNotificacionId") Integer tipoNotificacionId,
            @Param("fecha") OffsetDateTime fecha,
            @Param("mensaje") String mensaje
    );

    /**
     * Obtiene las notificaciones no leídas por usuario y módulo
     */
    @Query("""
        SELECT n
        FROM Notificacion n
        WHERE n.usuario.id = :usuarioId
          AND n.modulo.id = :moduloId
          AND n.activo = true
          AND n.fechaLectura IS NULL
        ORDER BY n.tipoNotificacion.prioridad DESC, n.fechaCreacion DESC
    """)
    List<Notificacion> findUnreadByUsuarioAndModulo(
            @Param("usuarioId") Integer usuarioId,
            @Param("moduloId") Integer moduloId
    );

    /**
     * Cuenta las notificaciones no leídas por usuario y módulo
     */
    @Query("""
        SELECT COUNT(n)
        FROM Notificacion n
        WHERE n.usuario.id = :usuarioId
          AND n.modulo.id = :moduloId
          AND n.activo = true
          AND n.fechaLectura IS NULL
    """)
    int countUnreadByUsuarioAndModulo(
            @Param("usuarioId") Integer usuarioId,
            @Param("moduloId") Integer moduloId
    );

    /**
     * Obtiene todas las notificaciones no leídas del usuario (todos los módulos)
     */
    @Query("""
        SELECT n
        FROM Notificacion n
        WHERE n.usuario.id = :usuarioId
          AND n.activo = true
          AND n.fechaLectura IS NULL
        ORDER BY n.tipoNotificacion.prioridad DESC, n.fechaCreacion DESC
    """)
    List<Notificacion> findAllUnreadByUsuario(@Param("usuarioId") Integer usuarioId);

    /**
     * Cuenta todas las notificaciones no leídas del usuario
     */
    @Query("""
        SELECT COUNT(n)
        FROM Notificacion n
        WHERE n.usuario.id = :usuarioId
          AND n.activo = true
          AND n.fechaLectura IS NULL
    """)
    int countAllUnreadByUsuario(@Param("usuarioId") Integer usuarioId);

    /**
     * Obtiene todas las notificaciones del usuario (leídas y no leídas) para un módulo específico
     */
    @Query("""
        SELECT n
        FROM Notificacion n
        WHERE n.usuario.id = :usuarioId
          AND n.modulo.id = :moduloId
          AND n.activo = true
        ORDER BY n.tipoNotificacion.prioridad DESC, n.fechaCreacion DESC
    """)
    List<Notificacion> findAllByUsuarioAndModulo(
            @Param("usuarioId") Integer usuarioId,
            @Param("moduloId") Integer moduloId
    );

    /**
     * Obtiene todas las notificaciones del usuario (leídas y no leídas) de todos los módulos
     */
    @Query("""
        SELECT n
        FROM Notificacion n
        WHERE n.usuario.id = :usuarioId
          AND n.activo = true
        ORDER BY n.tipoNotificacion.prioridad DESC, n.fechaCreacion DESC
    """)
    List<Notificacion> findAllByUsuario(@Param("usuarioId") Integer usuarioId);

    /**
     * Busca notificaciones de un usuario por tipo en un rango de fechas
     * Usado para verificar duplicados de recordatorios por entregable específico
     */
    @Query("""
        SELECT n
        FROM Notificacion n
        WHERE n.usuario.id = :usuarioId
          AND n.tipoNotificacion.id = :tipoNotificacionId
          AND n.activo = true
          AND n.fechaCreacion BETWEEN :fechaInicio AND :fechaFin
        ORDER BY n.fechaCreacion DESC
    """)
    List<Notificacion> findByUsuarioAndTipoAndFechaBetween(
            @Param("usuarioId") Integer usuarioId,
            @Param("tipoNotificacionId") Integer tipoNotificacionId,
            @Param("fechaInicio") OffsetDateTime fechaInicio,
            @Param("fechaFin") OffsetDateTime fechaFin
    );
} 