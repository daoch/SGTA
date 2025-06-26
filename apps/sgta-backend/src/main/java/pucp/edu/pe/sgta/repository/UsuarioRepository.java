package pucp.edu.pe.sgta.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.Usuario;

import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Usuario findByCorreoElectronicoIsLikeIgnoreCase(String email);

    Optional<Usuario> findByCodigoPucp(String codigoPucp);

    Optional<Usuario> findByCorreoElectronico(String correoElectronico);

    Optional<Usuario> findByIdCognito(String idCognito);

    @Query(value = "SELECT * FROM obtener_usuarios_con_temass()", nativeQuery = true)
    List<Object[]> findUsuarioTemaInfo();

    // SOLO PARA JURADOS
    @Query(value = "SELECT * FROM obtener_area_conocimiento(:usuario_id)", nativeQuery = true)
    List<Object[]> findAreaConocimientoByUsuarioId(@Param("usuario_id") Integer usuarioId);

    @Query(value = "SELECT * FROM obtener_usuarios_por_estado(:activo_param)", nativeQuery = true)
    List<Object[]> obtenerUsuariosPorEstado(@Param("activo_param") Boolean activoParam);

    @Query(value = "SELECT * FROM obtener_usuarios_por_area_conocimiento(:area_conocimiento_id)", nativeQuery = true)
    List<Object[]> obtenerUsuariosPorAreaConocimiento(@Param("area_conocimiento_id") Integer areaConocimientoId);

    // Comprueba si existe un usuario con ese id y cuyo tipoUsuario.nombre = el
    // pasado.
    Boolean existsByIdAndTipoUsuarioNombre(Integer usuarioId, String tipoNombre);

    // verificar que usuario existe y activo
    Boolean existsByIdAndActivoTrue(Integer usuarioId);

    Boolean existsByIdCognitoAndTipoUsuarioNombre(String cognito, String tipoUsuarioNombre);

    Optional<Usuario> findById(Integer id);

    @Query(value = "SELECT * FROM obtener_area_conocimiento_jurado(:usuarioId)", nativeQuery = true)
    List<Object[]> obtenerAreasConocimientoJurado(@Param("usuarioId") Integer usuarioId);

    @Query(value = "SELECT * FROM obtener_lista_directorio_asesores_alumno(:alumnoId,:cadenaBusqueda, :activo, " +
            "cast(:areaIds as INTEGER[]), cast(:temaIds as INTEGER[]))", nativeQuery = true)
    Page<Object[]> obtenerListaDirectorioAsesoresAlumno(@Param("alumnoId") Integer alumnoId,
                                                        @Param("cadenaBusqueda") String cadenaBusqueda,
                                                        @Param("activo") Boolean activo,
                                                        @Param("areaIds") String areaIds,
                                                        @Param("temaIds") String temaIds,
                                                        Pageable pageable);

    @Query(value = "SELECT * FROM obtener_lista_directorio_asesores_alumno(:alumnoId,:cadenaBusqueda, :activo, " +
            "cast(:areaIds as INTEGER[]), cast(:temaIds as INTEGER[]))", nativeQuery = true)
    List<Object[]> buscarAsesoresPorCadenaDeBusqueda(@Param("alumnoId") Integer alumnoId,
                                                        @Param("cadenaBusqueda") String cadenaBusqueda,
                                                        @Param("activo") Boolean activo,
                                                        @Param("areaIds") String areaIds,
                                                        @Param("temaIds") String temaIds);


    @Query(value = """
            SELECT * FROM obtener_coordinador_por_carrera_usuario(:usuarioId)
            """, nativeQuery = true)
    List<Object[]> obtenerIdCoordinadorPorUsuario(
            @Param("usuarioId") Integer usuarioId);

    @Query(value = """
            SELECT * FROM cantidad_coordinador_por_carrera_tema(:temaId)
            """, nativeQuery = true)
    List<Object[]> obtenerCantidadDeCoordinadoresPorTema(
            @Param("temaId") Integer temaId);


    // NUEVO MÉTODO para encontrar usuarios (coordinadores) activos de una carrera específica por tipo de usuario
    @Query("SELECT uc.usuario FROM UsuarioXCarrera uc " +
            "JOIN uc.usuario u " +        // uc.usuario es el campo 'usuario' en la entidad UsuarioXCarrera
            "JOIN u.tipoUsuario tu " +    // u.tipoUsuario es el campo 'tipoUsuario' en la entidad Usuario
            "JOIN uc.carrera c " +        // uc.carrera es el campo 'carrera' en la entidad UsuarioXCarrera
            "WHERE tu.nombre = :tipoUsuarioNombre " +
            "AND c.id = :carreraId " +
            "AND u.activo = true " +      // El usuario debe estar activo
            "AND uc.activo = true")       // La relación usuario-carrera debe estar activa
    List<Usuario> findUsuariosActivosPorCarreraYTipo(
            @Param("carreraId") Integer carreraId,
            @Param("tipoUsuarioNombre") String tipoUsuarioNombre
    );


    boolean existsByIdCognito(String idCognito);

    @Query(value = """
            SELECT * FROM obtener_profesores()
            """, nativeQuery = true)
    List<Object[]> obtenerProfesores();

    @Query(value = "SELECT * FROM obtener_perfil_usuario(:usuarioId)", nativeQuery = true)
    List<Object[]> obtenerPerfilUsuario(@Param("usuarioId") Integer usuarioId);

    @Query(value = "SELECT obtener_id_cognito_por_usuario(:usuarioId)", nativeQuery = true)
    String findIdCognitoByUsuarioId(@Param("usuarioId") Integer usuarioId);

    @Query(value = "SELECT * FROM listar_revisores_por_carrera(:carreraId)", nativeQuery = true)
    List<Object[]> listarRevisoresPorCarrera(@Param("carreraId") Integer carreraId);

    @Query(value = "SELECT obtener_usuario_id_por_cognito_id(:idCognito)", nativeQuery = true)
    Integer findUsuarioIdByIdCognito(@Param("idCognito")String idCognito);

    List<Usuario> findAllById(Iterable<Integer> ids);

    @Modifying
     @Query(value = "call set_refresh_token(:p_id_usuario,:p_refresh_token)",nativeQuery = true)
    void setRefreshToken(@Param("p_id_usuario")Integer idUsuario,@Param("p_refresh_token")String refreshToken);

    @Query(value = "SELECT * FROM obtener_usuarios_por_coordinador(:idCognito)", nativeQuery = true)
    List<Object[]> obtenerUsuariosPorCoordinador(@Param("idCognito") String idCognito);

    @Query(value = "SELECT * FROM obtener_todos_los_usuarios()", nativeQuery = true)
    List<Object[]> obtenerTodosLosUsuarios();
}
