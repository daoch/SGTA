package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.RolSolicitud; // Asegúrate de importar tu entidad RolSolicitud

import java.util.Optional;

@Repository
public interface RolSolicitudRepository extends JpaRepository<RolSolicitud, Integer> {

    // Método para buscar un RolSolicitud por su nombre
    // Spring Data JPA generará la implementación automáticamente
    Optional<RolSolicitud> findByNombre(String nombre);

    // Puedes añadir otros métodos de búsqueda si los necesitas
}