package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.RolSolicitud;

import java.util.Optional;

@Repository
public interface RolSolicitudRepository extends JpaRepository<RolSolicitud, Integer> {
    boolean existsByNombre(String nombre);
    Optional<RolSolicitud> findByNombre(String nombre);
}
