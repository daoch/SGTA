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

    @Query(value = "SELECT * FROM obtener_usuarios_con_temass()", nativeQuery = true)
    List<Object[]> findUsuarioTemaInfo();

    // SOLO PARA JURADOS
    @Query(value = "SELECT * FROM obtener_area_conocimiento(:usuario_id)", nativeQuery = true)
    List<Object[]> findAreaConocimientoByUsuarioId(@Param("usuario_id") Integer usuarioId);

    @Query(value = "SELECT * FROM obtener_usuarios_por_estado(:activo_param)", nativeQuery = true)
    List<Object[]> obtenerUsuariosPorEstado(@Param("activo_param") Boolean activoParam);

    @Query(value = "SELECT * FROM obtener_usuarios_por_area_conocimiento(:area_conocimiento_id)", nativeQuery = true)
    List<Object[]> obtenerUsuariosPorAreaConocimiento(@Param("area_conocimiento_id") Integer areaConocimientoId);
}
