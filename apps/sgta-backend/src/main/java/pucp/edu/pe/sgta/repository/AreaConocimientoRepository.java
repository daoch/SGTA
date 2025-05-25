package pucp.edu.pe.sgta.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import pucp.edu.pe.sgta.model.AreaConocimiento;

public interface AreaConocimientoRepository extends JpaRepository<AreaConocimiento, Integer> {

	List<AreaConocimiento> findAllByActivoTrue();

	List<AreaConocimiento> findAllByCarreraIdAndActivoTrue(Integer idCarrera);

	List<AreaConocimiento> findAllByIdIn(List<Integer> ids);

	List<AreaConocimiento> findByNombreContainingIgnoreCaseAndActivoIsTrue(String nombre);

	List<AreaConocimiento> findByCarreraIdInAndActivoTrue(List<Integer> idCarrera);

}
