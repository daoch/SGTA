package pucp.edu.pe.sgta.repository;

import pucp.edu.pe.sgta.model.Modulo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ModuloRepository extends JpaRepository<Modulo, Integer> {

    /**
     * Busca un módulo por su nombre
     */
    @Query("SELECT m FROM Modulo m WHERE m.nombre = :nombre AND m.activo = true")
    Optional<Modulo> findByNombre(@Param("nombre") String nombre);

    /**
     * Busca el módulo de Reportes específicamente
     */
    @Query("SELECT m FROM Modulo m WHERE m.nombre = 'Reportes' AND m.activo = true")
    Optional<Modulo> findModuloReportes();
} 