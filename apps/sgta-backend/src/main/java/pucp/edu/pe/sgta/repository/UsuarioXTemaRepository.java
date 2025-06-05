package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.config.SgtaConstants;
import pucp.edu.pe.sgta.dto.asesores.AsesorTemaActivoDto;
import pucp.edu.pe.sgta.model.Rol;
import pucp.edu.pe.sgta.model.Usuario;
import org.springframework.transaction.annotation.Transactional;
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

        UsuarioXTema findFirstByUsuario_IdAndRol_IdAndActivoTrueOrderByFechaCreacionDesc(Integer usuarioId, Integer rolId);
        UsuarioXTema findFirstByTemaIdAndRolNombreAndActivoTrue(Integer temaId, String nombreRol);

        Optional<UsuarioXTema> findByUsuarioId(Integer usuarioId);

        @Query("SELECT COUNT(uxt) FROM UsuarioXTema uxt WHERE uxt.usuario.id = :usuarioId AND uxt.rol.nombre = :rolNombre AND uxt.activo = true")
        int countTemasActivosAsesor(@Param("usuarioId") Integer usuarioId, @Param("rolNombre") String rolNombre);

        @Query("SELECT COUNT(ut) FROM UsuarioXTema ut WHERE ut.usuario.id = :usuarioId AND ut.rol.nombre = :rolNombre AND ut.activo = true")
        long countByUsuarioIdAndRolNombreAndActivoTrue(@Param("usuarioId") Integer usuarioId, @Param("rolNombre") String rolNombre);


        // Método para verificar si existe una relación activa para un tema, usuario y rol específicos
        // Spring Data JPA generará la query basada en el nombre del método.
        // Los parámetros deben coincidir con los campos de la entidad UsuarioXTema:
        // tema.id -> temaId
        // usuario.id -> usuarioId
        // rol.id -> rolId
        // activo -> activo
        boolean existsByTema_IdAndUsuario_IdAndRol_IdAndActivoTrue(Integer temaId, Integer usuarioId, Integer rolId);

        // Método para obtener todas las relaciones activas para un tema y rol específicos (ej. todos los tesistas de un tema)
        // Los nombres de los campos en la entidad son 'tema', 'usuario', 'rol'. Usamos '_Id' para acceder a sus IDs.
        List<UsuarioXTema> findByTema_IdAndRol_IdAndActivoTrue(Integer temaId, Integer rolId);

        // Método para obtener la primera relación activa para un tema y nombre de rol específico
        // Este ya lo tenías y es un buen ejemplo de cómo usar @Query para joins más explícitos
        @Query("SELECT ut FROM UsuarioXTema ut JOIN ut.rol r WHERE ut.tema.id = :temaId AND r.nombre = :rolNombre AND ut.activo = true ORDER BY ut.fechaCreacion ASC")
        List<UsuarioXTema> findByTemaIdAndRolNombreAndActivoTrueOrderByFechaCreacionAsc(
                @Param("temaId") Integer temaId,
                @Param("rolNombre") String rolNombre
        );

        // (Opcional) Si necesitas desvincular (marcar como inactivo) todas las relaciones de un asesor con un tema:
        @Query("SELECT ut FROM UsuarioXTema ut WHERE ut.tema.id = :temaId AND ut.usuario.id = :usuarioId AND ut.rol.id = :rolId AND ut.activo = true")
        List<UsuarioXTema> findByTemaIdAndUsuarioIdAndRolIdAndActivoTrue(
                @Param("temaId") Integer temaId,
                @Param("usuarioId") Integer usuarioId,
                @Param("rolId") Integer rolId
        );

        List<UsuarioXTema> findByUsuarioAndRolAndActivoTrue(Usuario usuario, Rol rol);

        // Para contar temas activos de un asesor por objeto Usuario y nombre de Rol
        Integer countByUsuarioAndRol_NombreAndActivoTrue(Usuario usuario, String rolNombre);

        @Query("SELECT new pucp.edu.pe.sgta.dto.asesores.AsesorTemaActivoDto(ut.tema.id, ut.tema.titulo) " +
                "FROM UsuarioXTema ut " +
                "WHERE ut.usuario.id = :asesorId AND ut.rol.nombre = '" + SgtaConstants.ROL_NOMBRE_ASESOR + "' AND ut.activo = true AND ut.tema.activo = true " +
                "GROUP BY ut.tema.id, ut.tema.titulo") // GROUP BY para evitar duplicados si hay múltiples relaciones al mismo tema (no debería)
        List<AsesorTemaActivoDto> findTemasActivosDtoByAsesorId(@Param("asesorId") Integer asesorId);

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


        @Query(
        value = "SELECT tiene_rol_en_tema(:usuarioId, :temaId, :rolNombre)",
        nativeQuery = true
        )
        boolean verificarUsuarioRolEnTema(
                @Param("usuarioId") Integer usuarioId,
                @Param("temaId")    Integer temaId,
                @Param("rolNombre") String rolNombre
        );
        
        @Modifying
        @Transactional
        @Query("UPDATE UsuarioXTema u SET u.activo = false WHERE u.id = :id")
        void softDeleteById(@Param("id") Integer id);
        // Devuelve Optional<UsuarioXTema> por tema y usuario, solo si está activo
        Optional<UsuarioXTema> findByTemaIdAndUsuarioIdAndActivoTrue(Integer temaId, Integer usuarioId);

        Optional<UsuarioXTema> findByUsuarioIdAndTemaIdAndRolId(Integer usuarioId, Integer temaId, Integer rolId);

        Optional<UsuarioXTema> findByUsuario_IdAndTema_Id(Integer usuarioId, Integer temaId);
        // Devuelve lista de UsuarioXTema por tema, donde asignado = false y activo = true
        List<UsuarioXTema> findByTemaIdAndAsignadoFalseAndActivoTrue(Integer temaId);
}
