package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.Modulo;
import java.util.Optional;

@Repository
public interface ModuloRepository extends JpaRepository<Modulo, Integer> {
    Optional<Modulo> findByNombre(String nombre);
}