package pucp.edu.pe.sgta.repository;

import pucp.edu.pe.sgta.model.TipoNotificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TipoNotificacionRepository extends JpaRepository<TipoNotificacion, Integer> {

    /**
     * Busca un tipo de notificación por su nombre
     */
    @Query("SELECT tn FROM TipoNotificacion tn WHERE tn.nombre = :nombre AND tn.activo = true")
    Optional<TipoNotificacion> findByNombre(@Param("nombre") String nombre);

    /**
     * Busca el tipo de notificación de recordatorio
     */
    @Query("SELECT tn FROM TipoNotificacion tn WHERE tn.nombre = 'recordatorio' AND tn.activo = true")
    Optional<TipoNotificacion> findTipoRecordatorio();

    /**
     * Busca el tipo de notificación de error
     */
    @Query("SELECT tn FROM TipoNotificacion tn WHERE tn.nombre = 'error' AND tn.activo = true")
    Optional<TipoNotificacion> findTipoError();
} 