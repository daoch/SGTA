package pucp.edu.pe.sgta.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import pucp.edu.pe.sgta.model.RolSolicitud;
import pucp.edu.pe.sgta.model.Solicitud;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.model.UsuarioXSolicitud;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface UsuarioXSolicitudRepository extends JpaRepository<UsuarioXSolicitud, Integer> {

    List<UsuarioXSolicitud> findBySolicitud(Solicitud solicitud);

    UsuarioXSolicitud findFirstBySolicitudAndDestinatarioTrue(Solicitud solicitud);

    UsuarioXSolicitud findFirstBySolicitudAndDestinatarioFalse(Solicitud solicitud);

    Optional<UsuarioXSolicitud> findFirstBySolicitudIdAndUsuarioIdAndActivoTrue(Integer id, Integer usuarioId);

    @Query(value = "SELECT * FROM puede_usuario_cambiar_solicitud(:idUsuario, :nombreRol, :idSolicitud)", nativeQuery = true)
    List<Object[]> puedeUsuarioCambiarSolicitud(@Param("idUsuario") Integer idUsuario,
            @Param("nombreRol") String nombreRol,
            @Param("idSolicitud") Integer idSolicitud);

    @Modifying
    @Query(value = "CALL procesar_solicitud_cambio(:idUsuario, :nombreRol, :idSolicitud, :aprobar)", nativeQuery = true)
    void procesarSolicitudCambio(@Param("idUsuario") Integer idUsuario,
            @Param("nombreRol") String nombreRol,
            @Param("idSolicitud") Integer idSolicitud,
            @Param("aprobar") Boolean aprobar);
            
    @Query(value = "SELECT * FROM puede_usuario_cesar_asesoria(:idUsuario, :nombreRol, :idSolicitud)", nativeQuery = true)
    List<Object[]> puedeUsuarioCesarAsesoria(@Param("idUsuario") Integer idUsuario,
            @Param("nombreRol") String nombreRol,
            @Param("idSolicitud") Integer idSolicitud);

    @Modifying
    @Query(value = "CALL procesar_cese_asesoria(:idUsuario, :nombreRol, :idSolicitud, :aprobar)", nativeQuery = true)
    void procesarCeseAsesoria(@Param("idUsuario") Integer idUsuario,
            @Param("nombreRol") String nombreRol,
            @Param("idSolicitud") Integer idSolicitud,
            @Param("aprobar") Boolean aprobar);

    @Modifying
    @Query(value = "CALL aprobar_solicitud_cambio_asesor_asesor(:idCognito, :solicitudId, :comentario, :rol_nombre)", nativeQuery = true)
    void aprobarSolicitudCambioAsesorAsesor(@Param("idCognito") String idCognito,
                                            @Param("solicitudId") Integer solicitudId,
                                            @Param("comentario") String comentario,
                                            @Param("rol_nombre") String rol);
    @Modifying
    @Query(value = "CALL rechazar_solicitud_cambio_asesor_asesor(:idCognito, :solicitudId, :comentario, :rol_nombre)", nativeQuery = true)
    void rechazarSolicitudCambioAsesorAsesor(@Param("idCognito") String idCognito,
                                            @Param("solicitudId") Integer solicitudId,
                                             @Param("comentario") String comentario,
                                             @Param("rol_nombre") String rol);
    @Modifying
    @Query(value = "CALL rechazar_solicitud_cambio_asesor_coordinador(:idCognito, :solicitudId, :comentario)", nativeQuery = true)
    void rechazarSolicitudCambioAsesorCoordinador(@Param("idCognito") String idCognito,
                                            @Param("solicitudId") Integer solicitudId,
                                                  @Param("comentario") String comentario);
    @Modifying
    @Query(value = "CALL aprobar_solicitud_cambio_asesor_coordinador(:idCognito, :solicitudId, :comentario)", nativeQuery = true)
    void aprobarSolicitudCambioAsesorCoordinador(@Param("idCognito") String idCognito,
                                            @Param("solicitudId") Integer solicitudId,
                                                 @Param("comentario") String comentario);

    Optional<UsuarioXSolicitud> findFirstBySolicitudIdAndRolSolicitud(Integer solicitudId, RolSolicitud rolSolicitud);

    boolean existsBySolicitud_IdAndUsuario_IdAndRolSolicitud_Nombre(
            Integer solicitudId,
            Integer usuarioId,
            String rolSolicitudNombre
    );

    List<UsuarioXSolicitud> findByUsuarioAndRolSolicitud_NombreAndActivoTrue(Usuario usuario, String rolNombre);

    UsuarioXSolicitud findFirstBySolicitudAndRolSolicitudAndActivoTrue(Solicitud solicitud, RolSolicitud rolSolicitud);

    Page<UsuarioXSolicitud> findByUsuarioAndRolSolicitudAndActivoTrue(Usuario usuario,
                                                                  RolSolicitud rol,
                                                                  Pageable pageable);
}
