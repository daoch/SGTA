package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.EstadoSolicitud;

import java.util.Optional;

@Repository
public interface EstadoSolicitudRepository extends JpaRepository<EstadoSolicitud, Integer> {
    boolean existsByNombre(String nombre);

    Optional<EstadoSolicitud> findByNombre(String nombre);

}
