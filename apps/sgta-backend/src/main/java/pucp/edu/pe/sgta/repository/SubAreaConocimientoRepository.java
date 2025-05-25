package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pucp.edu.pe.sgta.model.SubAreaConocimiento;

import java.util.List;

public interface SubAreaConocimientoRepository extends JpaRepository<SubAreaConocimiento, Integer> {

	List<SubAreaConocimiento> findAllByActivoTrue();

	List<SubAreaConocimiento> findAllByAreaConocimientoIdAndActivoTrue(Integer idAreaConocimiento);

	List<SubAreaConocimiento> findAllByAreaConocimientoIdInAndActivoTrue(List<Integer> idAreaConocimiento);

	List<SubAreaConocimiento> findAllByIdIn(List<Integer> ids);

	List<SubAreaConocimiento> findByNombreContainingIgnoreCaseAndActivoIsTrue(String nombre);

}
