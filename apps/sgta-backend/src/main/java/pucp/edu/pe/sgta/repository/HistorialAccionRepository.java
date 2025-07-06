package pucp.edu.pe.sgta.repository;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import pucp.edu.pe.sgta.model.HistorialAccion;

public interface HistorialAccionRepository extends JpaRepository<HistorialAccion, Long> {

    /**
     * Encuentra todas las acciones de un usuario cognito específico.
     */
    List<HistorialAccion> findByIdCognito(String idCognito);

    /**
     * Encuentra todas las acciones cuya fecha de creación esté entre dos instantes.
     */
    List<HistorialAccion> findByFechaCreacionBetween(OffsetDateTime desde, OffsetDateTime hasta);

    /**
     * Busca acciones cuyo texto contenga (ignorando mayúsculas/minúsculas) la cadena dada.
     */
    List<HistorialAccion> findByAccionContainingIgnoreCase(String termino);

}
