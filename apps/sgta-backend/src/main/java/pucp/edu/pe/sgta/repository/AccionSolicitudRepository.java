package pucp.edu.pe.sgta.repository; // Ajusta este paquete a tu estructura

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.AccionSolicitud; // Importa tu entidad AccionSolicitud

import java.util.Optional;

@Repository
public interface AccionSolicitudRepository extends JpaRepository<AccionSolicitud, Integer> {

    // Método para encontrar una AccionSolicitud por su nombre.
    // Spring Data JPA generará la implementación basada en el nombre del método.
    // Devuelve Optional porque el nombre podría no existir.
    Optional<AccionSolicitud> findByNombre(String nombre);

    // Puedes añadir otros métodos de búsqueda si los necesitas.
}