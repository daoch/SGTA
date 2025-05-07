package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pucp.edu.pe.sgta.model.CarreraXParametroConfiguracion;
import java.util.List;

public interface CarreraXParametroConfiguracionRepository extends JpaRepository<CarreraXParametroConfiguracion, Integer> {
    List<CarreraXParametroConfiguracion> findByCarreraId(Long carreraId);
}
