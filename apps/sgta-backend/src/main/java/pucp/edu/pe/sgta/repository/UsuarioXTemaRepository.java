package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import pucp.edu.pe.sgta.dto.MiembroJuradoSimplificadoDTO;
import pucp.edu.pe.sgta.model.Rol;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.model.UsuarioXTema;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioXTemaRepository extends JpaRepository<UsuarioXTema, Integer> {

        List<UsuarioXTema> findByUsuarioIdAndActivoTrue(Integer usuarioId);

        @Query(value = """
                            SELECT *
                                FROM obtener_numero_tesistas_asesor(:id)
                        """, nativeQuery = true)
        List<Object[]> listarNumeroTesistasAsesor(@Param("id") Integer idAsesor);

        @Query(value = """
                            SELECT *
                                FROM obtener_tesistas_tema(:id)
                        """, nativeQuery = true)
        List<Object[]> listarTesistasTema(@Param("id") Integer idTema);

        // Comprueba si el tesista está asignado a un tema
        boolean existsByUsuarioIdAndRolNombreAndActivoTrueAndAsignadoTrue(
                        Integer usuarioId,
                        String rolNombre);

        List<UsuarioXTema> findByUsuarioIdAndRolId(Integer usuarioId, Integer rolId);

        List<UsuarioXTema> findByTemaIdAndActivoTrue(Integer temaId);

        long countByTemaIdAndActivoTrue(Integer temaId);

        long countByRolIdAndActivoTrue(Integer temaId);

        Optional<UsuarioXTema> findByUsuarioIdAndTemaIdAndRolIdAndActivoTrue(Integer usuarioId, Integer temaId,
                        Integer rolId);

        @Query(value = """
                            SELECT *
                                FROM obtener_jurados_por_tema(:id)
                        """, nativeQuery = true)
        Integer obtenerJuradosPorTema(@Param("id") Integer cantidadJurados);

        List<UsuarioXTema> findByUsuarioIdAndRolNombreAndActivoTrue(Integer usuarioId, String nombreRol);

        List<UsuarioXTema> findByTemaIdAndRolNombreAndActivoTrue(Integer temaId, String nombreRol);

        UsuarioXTema findFirstByUsuario_IdAndRol_IdAndActivoTrueOrderByFechaCreacionDesc(Integer usuarioId,
                        Integer rolId);

        UsuarioXTema findFirstByTemaIdAndRolNombreAndActivoTrue(Integer temaId, String nombreRol);

        Optional<UsuarioXTema> findByUsuarioId(Integer usuarioId);

        @Query(value = "SELECT tiene_rol_en_tema(:usuarioId, :temaId, :rolNombre)", nativeQuery = true)
        boolean verificarUsuarioRolEnTema(
                        @Param("usuarioId") Integer usuarioId,
                        @Param("temaId") Integer temaId,
                        @Param("rolNombre") String rolNombre);

        @Modifying
        @Transactional
        @Query("UPDATE UsuarioXTema u SET u.activo = false WHERE u.id = :id")
        void softDeleteById(@Param("id") Integer id);

        // Devuelve Optional<UsuarioXTema> por tema y usuario, solo si está activo
        Optional<UsuarioXTema> findByTemaIdAndUsuarioIdAndActivoTrue(Integer temaId, Integer usuarioId);

        Optional<UsuarioXTema> findByUsuarioIdAndTemaIdAndRolId(Integer usuarioId, Integer temaId, Integer rolId);

        Optional<UsuarioXTema> findByUsuario_IdAndTema_Id(Integer usuarioId, Integer temaId);

        // Devuelve lista de UsuarioXTema por tema, donde asignado = false y activo =
        // true
        List<UsuarioXTema> findByTemaIdAndAsignadoFalseAndActivoTrue(Integer temaId);

        @Query(value = """
                            SELECT *
                                FROM obtener_miembros_jurado_x_exposicion_tema(:exposicion_tema_id)
                        """, nativeQuery = true)
        List<MiembroJuradoSimplificadoDTO> obtenerMiembrosJuradoPorExposicionTema(
                        @Param("exposicion_tema_id") Integer exposicionTemaId);

        Optional<UsuarioXTema> findByUsuarioIdAndTemaIdAndRolIdIn(
                        Integer usuarioId, Integer temaId, List<Integer> rolIds);

        List<UsuarioXTema> findByUsuarioIdAndActivoTrueAndAsignadoTrue(Integer usuarioId);

        List<UsuarioXTema> findByUsuarioAndRolAndActivoTrue(Usuario usuario, Rol rol);

        // Para contar temas activos de un asesor por objeto Usuario y nombre de Rol
        Integer countByUsuarioAndRol_NombreAndActivoTrue(Usuario usuario, String rolNombre);

        // Método para obtener todas las relaciones activas para un tema y rol específicos (ej. todos los tesistas de un tema)
        // Los nombres de los campos en la entidad son 'tema', 'usuario', 'rol'. Usamos '_Id' para acceder a sus IDs.
        List<UsuarioXTema> findByTema_IdAndRol_IdAndActivoTrue(Integer temaId, Integer rolId);

        @Query("SELECT COUNT(ut) FROM UsuarioXTema ut WHERE ut.usuario.id = :usuarioId AND ut.rol.nombre = :rolNombre AND ut.activo = true")
        long countByUsuarioIdAndRolNombreAndActivoTrue(@Param("usuarioId") Integer usuarioId, @Param("rolNombre") String rolNombre);

        boolean existsByTema_IdAndUsuario_IdAndRol_IdAndActivoTrue(Integer temaId, Integer usuarioId, Integer rolId);

        @Query(value = """
                SELECT ut.usuario_id
                FROM usuario_tema ut
                JOIN rol r ON r.rol_id = ut.rol_id
                WHERE ut.tema_id   = :temaId
                AND ut.activo    = true
                AND ut.rechazado = false
                AND r.nombre IN ('Asesor','Coasesor')
                ORDER BY
                CASE WHEN r.nombre = 'Asesor' THEN 0 ELSE 1 END,
                ut.usuario_id
                """, nativeQuery = true)
        List<Integer> findAsesorIdsByTemaId(@Param("temaId") Integer temaId);

        /**
         * Devuelve los IDs de usuario que son Tesista en el tema, ordenados por ID.
         */
        @Query(value = """
                SELECT ut.usuario_id
                FROM usuario_tema ut
                JOIN rol r ON r.rol_id = ut.rol_id
                WHERE ut.tema_id   = :temaId
                AND ut.activo    = true
                AND ut.rechazado = false
                AND r.nombre     = 'Tesista'
                ORDER BY ut.usuario_id
                """, nativeQuery = true)
        List<Integer> findTesistaIdsByTemaId(@Param("temaId") Integer temaId);

        /**
         * Encuentra todas las relaciones UsuarioXTema activas para un tema, usuario y rol específicos.
         * Útil para encontrar la(s) relación(es) del asesor original con un tema.
         * Aunque idealmente solo debería haber una activa, se devuelve una lista por si acaso.
         */
        List<UsuarioXTema> findByTema_IdAndUsuario_IdAndRol_IdAndActivoTrue(
                @Param("temaId") Integer temaId,
                @Param("usuarioId") Integer usuarioId,
                @Param("rolId") Integer rolId
        );

        /**
         * Encuentra la primera relación UsuarioXTema (activa o inactiva) para un tema, usuario y rol específicos.
         * Útil para verificar si ya existe alguna relación para el nuevo asesor propuesto,
         * para decidir si se actualiza una existente (marcando como activa) o se crea una nueva.
         * Ordenado por fecha de creación descendente para obtener la más reciente si hay varias (aunque no debería).
         */
        Optional<UsuarioXTema> findFirstByTema_IdAndUsuario_IdAndRol_IdOrderByFechaCreacionDesc(
                @Param("temaId") Integer temaId,
                @Param("usuarioId") Integer usuarioId,
                @Param("rolId") Integer rolId
        );

        List<UsuarioXTema> findByTemaIdInAndActivoTrue(List<Integer> temaIds);

}
