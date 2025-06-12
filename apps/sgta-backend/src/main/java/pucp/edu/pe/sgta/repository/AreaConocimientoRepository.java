package pucp.edu.pe.sgta.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import pucp.edu.pe.sgta.model.AreaConocimiento;

public interface AreaConocimientoRepository extends JpaRepository<AreaConocimiento, Integer> {

    List<AreaConocimiento> findAllByActivoTrue();

    List<AreaConocimiento> findAllByCarreraIdAndActivoTrue(Integer idCarrera);

    List<AreaConocimiento> findAllByIdIn(List<Integer> ids);

    List<AreaConocimiento> findByNombreContainingIgnoreCaseAndActivoIsTrue(String nombre);

    List<AreaConocimiento> findByCarreraIdInAndActivoTrue(List<Integer> idCarrera);

    @Query(value = "select * from listar_areas_por_tema(:temaId)", nativeQuery = true)
    List<AreaConocimiento> findByTemaId(@Param("temaId") Integer temaId);

    @Query(value = "select * from listar_areas_conocimiento_perfil_por_usuario(:usuarioId)", nativeQuery = true)
    List<Object[]> listarParaPerfilPorUsuarioId(@Param("usuarioId") Integer usuarioId);
}
