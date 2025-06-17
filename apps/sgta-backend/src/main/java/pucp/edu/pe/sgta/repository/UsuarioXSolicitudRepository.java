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
import pucp.edu.pe.sgta.model.UsuarioXSolicitud;

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

    Optional<UsuarioXSolicitud> findFirstBySolicitudIdAndRolSolicitud(Integer solicitudId, RolSolicitud rolSolicitud);
    
    boolean existsBySolicitud_IdAndUsuario_IdAndRolSolicitud_Nombre(
            Integer solicitudId,
            Integer usuarioId,
            String rolSolicitudNombre
    );
}
