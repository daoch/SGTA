package pucp.edu.pe.sgta.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import pucp.edu.pe.sgta.model.SubAreaConocimiento;

public interface SubAreaConocimientoRepository extends JpaRepository<SubAreaConocimiento, Integer> {
    List<SubAreaConocimiento> findAllByActivoTrue();
    List<SubAreaConocimiento> findAllByAreaConocimientoIdAndActivoTrue(Integer idAreaConocimiento);
}
