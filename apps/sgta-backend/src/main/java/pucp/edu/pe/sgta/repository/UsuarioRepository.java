package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.dto.MiembroJuradoDto;
import pucp.edu.pe.sgta.model.Usuario;

import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    @Query(value = "SELECT DISTINCT ON (u.usuario_id) " +
            "u.usuario_id, " +
            "u.codigo_pucp, " +
            "u.nombres, " +
            "u.primer_apellido, " +
            "u.segundo_apellido, " +
            "u.correo_electronico, " +
            "u.nivel_estudios, " +
            "COUNT(ut.tema_id) OVER (PARTITION BY u.usuario_id) AS cantidad_temas_asignados, " +
            "ut.activo AS tema_activo, " +
            "ut.fecha_creacion AS fecha_asignacion " +
            "FROM usuario u " +
            "JOIN usuario_tema ut ON u.usuario_id = ut.usuario_id " +
            "JOIN tema t ON ut.tema_id = t.tema_id " +
            "WHERE ut.rol_id = 2 " +
            "ORDER BY u.usuario_id, ut.prioridad", nativeQuery = true)
    List<Object[]> findUsuarioTemaInfo();


    //SOLO PARA JURADOS
    @Query(value = "SELECT * FROM obtener_area_conocimiento(:usuario_id)", nativeQuery = true)
    List<Object[]> findAreaConocimientoByUsuarioId(@Param("usuario_id") Integer usuarioId);

    @Query(value = "SELECT * FROM obtener_usuarios_por_estado(:activo_param)", nativeQuery = true)
    List<Object[]> obtenerUsuariosPorEstado(@Param("activo_param") Boolean activoParam);

    @Query(value = "SELECT * FROM obtener_usuarios_por_area_conocimiento(:area_conocimiento_id)", nativeQuery = true)
    List<Object[]> obtenerUsuariosPorAreaConocimiento(@Param("area_conocimiento_id") Integer areaConocimientoId);

}
