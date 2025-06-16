package pucp.edu.pe.sgta.repository;

import pucp.edu.pe.sgta.model.EstadoSolicitud;
import pucp.edu.pe.sgta.model.Solicitud;
import pucp.edu.pe.sgta.model.Tema;
import pucp.edu.pe.sgta.model.TipoSolicitud;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor; // <<--- IMPORTAR ESTO
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Integer>, JpaSpecificationExecutor {
    List<Solicitud> findByTipoSolicitudId(Integer tipoSolicitudId);

    List<Solicitud> findByTipoSolicitudNombre(String tipoSolicitudNombre);

    Optional<Solicitud> findById(Integer id);

    @Query(value = "SELECT * FROM get_solicitudes_by_tema(:input_tema_id, :offset_val, :limit_val)", nativeQuery = true)
    List<Object[]> findSolicitudesByTemaWithProcedure(@Param("input_tema_id") Integer temaId,
            @Param("offset_val") Integer offset,
            @Param("limit_val") Integer limit);

    @Query(value = "SELECT COUNT(*) FROM get_solicitudes_by_tema_count(:temaId)", nativeQuery = true)
    Integer countSolicitudesByTema(@Param("temaId") Integer temaId);

    Optional<Solicitud> findByTipoSolicitudNombreAndTemaIdAndActivoTrue(String string, Integer temaId);

    @Query(value = "SELECT * FROM listar_resumen_solicitud_cambio_asesor_usuario(:idUsuario,:nombreRol)", nativeQuery = true)
    List<Object[]> listarResumenSolicitudCambioAsesorUsuario(@Param("idUsuario") Integer idUsuario,
            @Param("nombreRol") String nombreRol);

    @Query(value = "SELECT * FROM obtener_detalle_solicitud_cambio_asesor(:idSolicitud)", nativeQuery = true)
    List<Object[]> listarDetalleSolicitudCambioAsesor(@Param("idSolicitud") Integer idSolicitud);

    @Query(value = "SELECT * FROM obtener_detalle_usuario_solicitud_cambio_asesor(:idUsuario,:idSolicitud)", nativeQuery = true)
    List<Object[]> listarDetalleUsuarioSolicitudCambioAsesor(@Param("idUsuario") Integer idUsuario,
            @Param("idSolicitud") Integer idSolicitud);

    boolean existsSolicitudByIdAndEstadoSolicitud_Nombre(Integer idSolicitud, String nombreSolicitud);

    @Query(value = "SELECT * FROM listar_resumen_solicitud_cese_asesoria_usuario(:idUsuario,:nombreRol)", nativeQuery = true)
    List<Object[]> listarResumenSolicitudCeseAsesoriaUsuario(@Param("idUsuario") Integer idUsuario,
            @Param("nombreRol") String nombreRol);
            
    @Query(value = "SELECT * FROM obtener_detalle_solicitud_cese_asesoria(:idSolicitud)", nativeQuery = true)
    List<Object[]> listarDetalleSolicitudCeseAsesoria(@Param("idSolicitud") Integer idSolicitud);

    @Query(value = "SELECT * FROM obtener_detalle_usuario_solicitud_cese_asesoria(:idUsuario,:idSolicitud)", nativeQuery = true)
    List<Object[]> listarDetalleUsuarioSolicitudCeseAsesoria(@Param("idUsuario") Integer idUsuario,
            @Param("idSolicitud") Integer idSolicitud);

    // Para el listado del coordinador (cuando SÍ filtras por estado)
    @Query("SELECT s FROM Solicitud s JOIN s.tema t JOIN t.carrera c JOIN s.tipoSolicitud ts JOIN s.estadoSolicitud es " +
            "WHERE c.id IN :carreraIds AND ts.nombre = :tipoSolicitudNombre AND s.activo = true AND es.nombre IN :targetStatusNames")
    Page<Solicitud> findConFiltroEstado(
            @Param("carreraIds") List<Integer> carreraIds,
            @Param("tipoSolicitudNombre") String tipoSolicitudNombre,
            @Param("targetStatusNames") List<String> targetStatusNames,
            Pageable pageable
    );

    // Para el listado del coordinador (cuando NO filtras por estado)
    @Query("SELECT s FROM Solicitud s JOIN s.tema t JOIN t.carrera c JOIN s.tipoSolicitud ts " +
            "WHERE c.id IN :carreraIds AND ts.nombre = :tipoSolicitudNombre AND s.activo = true")
    Page<Solicitud> findSinFiltroEstado(
            @Param("carreraIds") List<Integer> carreraIds,
            @Param("tipoSolicitudNombre") String tipoSolicitudNombre,
            Pageable pageable
    );

    @Query("SELECT us.usuario.id FROM UsuarioXSolicitud us JOIN us.rolSolicitud rs " +
           "WHERE us.solicitud.id = :solicitudId AND rs.nombre = 'REMITENTE'")
    List<Integer> findRemitenteIdBySolicitudId(@Param("solicitudId") Integer solicitudId);
    
    // Para verificar si ya existe una solicitud PENDIENTE para un tema y tipo (usado al crear solicitud de cese)
    List<Solicitud> findByTemaAndTipoSolicitudAndEstadoSolicitudAndActivoTrue(
            Tema tema,
            TipoSolicitud tipoSolicitud,
            EstadoSolicitud estadoSolicitud
    );
}

