package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pucp.edu.pe.sgta.model.CarreraXParametroConfiguracion;
import java.util.List;
import java.util.Optional;

public interface CarreraXParametroConfiguracionRepository extends JpaRepository<CarreraXParametroConfiguracion, Integer> {
    List<CarreraXParametroConfiguracion> findByCarreraId(Long carreraId);

    Optional<CarreraXParametroConfiguracion> findFirstByParametroConfiguracionId(Integer parametroConfiguracionId);
    
    // Nuevo método para filtrar por carrera y etapa formativa
    List<CarreraXParametroConfiguracion> findByCarreraIdAndEtapaFormativaId(Long carreraId, Integer etapaFormativaId);
    
    // Método para obtener parámetros sin etapa formativa (null)
    List<CarreraXParametroConfiguracion> findByCarreraIdAndEtapaFormativaIdIsNull(Long carreraId);
}
