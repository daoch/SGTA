package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pucp.edu.pe.sgta.model.EstadoTema;

import java.util.Optional;

public interface EstadoTemaRepository extends JpaRepository<EstadoTema, Integer> {

	// Aquí puedes agregar métodos personalizados si es necesario
	// Por ejemplo, para buscar por nombre o estado específico
	Optional<EstadoTema> findByNombre(String nombre);

	Optional<EstadoTema> findById(Integer estadoTemaId);

}
