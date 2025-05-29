package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.Reunion;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReunionRepository extends JpaRepository<Reunion, Integer> {

    // Listar todas las reuniones activas
    List<Reunion> findByActivoTrue();

    // Buscar reunión por ID y activa
    Optional<Reunion> findByIdAndActivoTrue(Integer id);

    // Listar reuniones ordenadas por fecha (más recientes primero)
    List<Reunion> findByActivoTrueOrderByFechaHoraInicioDesc();

}