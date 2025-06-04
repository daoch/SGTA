package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
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

        @Query(
        value = "SELECT tiene_rol_en_tema(:usuarioId, :temaId, :rolNombre)",
        nativeQuery = true
        )
        boolean verificarUsuarioRolEnTema(
                @Param("usuarioId") Integer usuarioId,
                @Param("temaId")    Integer temaId,
                @Param("rolNombre") String rolNombre
        );

        Optional<UsuarioXTema> findByUsuarioIdAndTemaIdAndRolId(Integer usuarioId, Integer temaId, Integer rolId);

        Optional<UsuarioXTema> findByUsuario_IdAndTema_Id(Integer usuarioId, Integer temaId);
}
