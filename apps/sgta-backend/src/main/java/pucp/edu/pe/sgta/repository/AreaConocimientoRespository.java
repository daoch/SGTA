package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pucp.edu.pe.sgta.model.AreaConocimiento;

import java.util.List;

public interface AreaConocimientoRespository extends JpaRepository<AreaConocimiento, Integer> {
    List<AreaConocimiento> findAllByIdIn(List<Integer> ids);
}
