package pucp.edu.pe.sgta.repository;

import pucp.edu.pe.sgta.model.EstadoSolicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EstadoSolicitudRepository extends JpaRepository<EstadoSolicitud, Integer> {
    Optional<EstadoSolicitud> findByNombre(String nombre);
    boolean existsByNombre(String nombre);
}