package pucp.edu.pe.sgta.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.support.JpaRepositoryFactory;

import pucp.edu.pe.sgta.model.TipoObservacion;

@Repository
public interface TipoObservacionRepository extends JpaRepository<TipoObservacion, Integer> {

    // Aquí puedes agregar métodos personalizados si los necesitas
    // Por ejemplo, para buscar por nombre o descripción
    // List<TipoObservacion> findByNombreContaining(String nombre);
    // List<TipoObservacion> findByDescripcionContaining(String descripcion);

}
