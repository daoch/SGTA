package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pucp.edu.pe.sgta.model.ParametroConfiguracion;

import java.util.Optional;

public interface ParametroConfiguracionRepository  extends JpaRepository<ParametroConfiguracion,Integer> {
    Optional<ParametroConfiguracion> findByNombre(String nombre);
}
