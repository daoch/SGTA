package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.AccionSolicitud;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccionSolicitudRepository extends JpaRepository<AccionSolicitud, Integer> {
    boolean existsByNombre(String nombre);
    Optional<AccionSolicitud> findByNombre(String nombre);
}
