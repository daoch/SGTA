package pucp.edu.pe.sgta.repository; // Ajusta tu paquete

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Necesario si decides usar @Query explícitas
import org.springframework.data.repository.query.Param; // Necesario para @Query con parámetros
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.Notificacion;
import pucp.edu.pe.sgta.model.Usuario; // Asegúrate de importar Usuario

import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Integer> {

    // --- Métodos Corregidos para NotificacionServiceImpl ---

    /**
     * Encuentra todas las notificaciones activas para un usuario, ordenadas por fecha de creación descendente.
     * Usado cuando soloNoLeidas es false o null.
     * El campo en la entidad Notificacion es 'usuario'.
     */
    Page<Notificacion> findByUsuarioAndActivoTrueOrderByFechaCreacionDesc(
            Usuario usuario, // Cambiado de usuarioDestinatario a usuario
            Pageable pageable
    );

    /**
     * Encuentra todas las notificaciones activas y NO LEÍDAS para un usuario,
     * ordenadas por fecha de creación descendente.
     * Usado cuando soloNoLeidas es true.
     */
    Page<Notificacion> findByUsuarioAndFechaLecturaIsNullAndActivoTrueOrderByFechaCreacionDesc(
            Usuario usuario, // Cambiado de usuarioDestinatario a usuario
            Pageable pageable
    );

    /**
     * Cuenta el número de notificaciones activas y NO LEÍDAS para un usuario.
     * Usado para el contador en la campanita.
     */
    long countByUsuarioAndFechaLecturaIsNullAndActivoTrue(
            Usuario usuario // Cambiado de usuarioDestinatario a usuario
    );

    /**
     * Encuentra todas las notificaciones activas y NO LEÍDAS para un usuario (sin paginación).
     * Usado por el servicio para marcar todas como leídas.
     */
    List<Notificacion> findByUsuarioAndFechaLecturaIsNullAndActivoTrue(
            Usuario usuario // Cambiado de usuarioDestinatario a usuario
    );

    // El método @Query que tenías parece correcto y ya usa 'n.usuario'
    @Query("""
      SELECT COUNT(n)
      FROM Notificacion n
      WHERE n.usuario = :usuario
        AND n.activo = true
        AND n.fechaLectura IS NULL
    """)
    long contarNoLeidasPorUsuario(@Param("usuario") Usuario usuario);

    // Los métodos duplicados que tenías al final los he eliminado
    // ya que son funcionalmente idénticos a los de arriba después de la corrección.
}