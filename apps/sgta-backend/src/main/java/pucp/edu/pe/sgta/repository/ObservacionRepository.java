package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.Observacion;

@Repository
public interface ObservacionRepository extends JpaRepository<Observacion, Long> {
    // Puedes agregar métodos personalizados si los necesitas
}