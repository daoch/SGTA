package pucp.edu.pe.sgta.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.Rol;
import java.util.Optional;

@Repository
public interface RolRepository extends JpaRepository<Rol, Integer> {

    /**
     * Busca un rol por su nombre exacto
     */
    Optional<Rol> findByNombre(String nombre);

    /**
     * Busca roles cuyo nombre contenga el texto proporcionado (ignorando
     * mayúsculas/minúsculas)
     */
    Page<Rol> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);
}