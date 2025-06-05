package pucp.edu.pe.sgta.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.RolSolicitud;      // Importar tu entidad RolSolicitud
import pucp.edu.pe.sgta.model.Solicitud;
import pucp.edu.pe.sgta.model.UsuarioSolicitud; // Asegúrate de importar tu entidad UsuarioSolicitud

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioSolicitudRepository extends JpaRepository<UsuarioSolicitud, Integer> {

    // Método para buscar todas las relaciones UsuarioSolicitud para una solicitud_id específica
    // y un RolSolicitud específico.
    // Spring Data JPA generará la implementación.
    List<UsuarioSolicitud> findBySolicitudIdAndRolSolicitud(Integer solicitudId, RolSolicitud rolSolicitud);

    // Si necesitas buscar por el ID del rol en lugar del objeto RolSolicitud:
    // List<UsuarioSolicitud> findBySolicitudIdAndRolSolicitud_Id(Integer solicitudId, Integer rolSolicitudId);
    // Esto requeriría que en tu entidad UsuarioSolicitud, el campo para RolSolicitud se llame 'rolSolicitud'
    // y tenga un campo 'id'.

    // Un método opcional si quisieras encontrar una sola relación (útil si esperas solo un usuario con un rol específico para una solicitud)
    Optional<UsuarioSolicitud> findFirstBySolicitudIdAndRolSolicitud(Integer solicitudId, RolSolicitud rolSolicitud);

    // Método para verificar si existe una relación UsuarioSolicitud basada en
    // el ID de la Solicitud, el ID del Usuario, y el NOMBRE del RolSolicitud.
    boolean existsBySolicitud_IdAndUsuario_IdAndRolSolicitud_Nombre(
            Integer solicitudId,
            Integer usuarioId,
            String rolSolicitudNombre
    );

    @Query("SELECT us.solicitud FROM UsuarioSolicitud us " +
            "WHERE us.usuario.id = :asesorId " +
            "AND us.rolSolicitud.nombre = :rolSolicitanteNombre " +
            "AND us.solicitud.activo = true")
    Page<Solicitud> findSolicitudesByAsesorSolicitanteRol(
            @Param("asesorId") Integer asesorId,
            @Param("rolSolicitanteNombre") String rolSolicitanteNombre,
            Pageable pageable
    );

    List<UsuarioSolicitud> findBySolicitud_IdAndUsuario_IdAndRolSolicitud_Nombre(
            Integer solicitudId, Integer usuarioId, String rolSolicitudNombre
    );

    List<UsuarioSolicitud> findBySolicitud_IdAndRolSolicitud_Nombre(Integer solicitudId, String rolSolicitudNombre);

    /**
     * 2) Método con filtro de texto:
     *    Además de filtrar por asesorId y rol, aplica un LIKE (case‐insensitive)
     *    sobre los campos nombres, primerApellido, segundoApellido o correoElectronico
     *    del mismo `Usuario` (el asesor).
     *
     *  El parámetro `term` debe venir en minúsculas y contener los '%' necesarios:
     *    e.g. term = "%ricardo%"
     */
    @Query("""
      SELECT us.solicitud
      FROM UsuarioSolicitud us
      JOIN us.usuario u
      WHERE us.usuario.id = :asesorId
        AND us.rolSolicitud.nombre = :rol
        AND us.activo = true
        AND (
          LOWER(u.nombres) LIKE :term
          OR LOWER(u.primerApellido) LIKE :term
          OR LOWER(u.segundoApellido) LIKE :term
          OR LOWER(u.correoElectronico) LIKE :term
        )
    """)
    Page<Solicitud> findSolicitudesByAsesorAndRolAndNombreOrEmail(
            @Param("asesorId") Integer asesorId,
            @Param("rol") String rol,
            @Param("term") String term,
            Pageable pageable
    );

    // Puedes añadir otros métodos de búsqueda si los necesitas, por ejemplo:
    // List<UsuarioSolicitud> findByUsuarioIdAndActivoTrue(Integer usuarioId);
}