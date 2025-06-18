package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pucp.edu.pe.sgta.model.SubAreaConocimiento;

import java.util.List;
import java.util.Set;

public interface SubAreaConocimientoRepository extends JpaRepository<SubAreaConocimiento, Integer> {
    List<SubAreaConocimiento> findAllByActivoTrue();
    List<SubAreaConocimiento> findAllByAreaConocimientoIdAndActivoTrue(Integer idAreaConocimiento);
    List<SubAreaConocimiento> findAllByAreaConocimientoIdInAndActivoTrue(List<Integer> idAreaConocimiento);
    List<SubAreaConocimiento> findAllByIdIn(List<Integer> ids);
    List<SubAreaConocimiento> findByNombreContainingIgnoreCaseAndActivoIsTrue(String nombre);
    @Query(value = "select * from listar_sub_areas_conocimiento_perfil_por_usuario(:usuarioId)", nativeQuery = true)
    List<Object[]> listarParaPerfilPorUsuarioId(@Param("usuarioId") Integer usuarioId);

    List<SubAreaConocimiento> findByAreaConocimiento_IdIn(Set<Integer> areaIds);
}
