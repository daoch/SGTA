package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.model.Reunion;

import java.util.List;
import java.util.Optional;

public interface ReunionService {

    // Listar todas las reuniones activas
    List<Reunion> findAll();

    // Buscar reunión por ID
    Optional<Reunion> findById(Integer id);

    // Listar reuniones ordenadas por fecha
    List<Reunion> findAllOrderedByDate();

}