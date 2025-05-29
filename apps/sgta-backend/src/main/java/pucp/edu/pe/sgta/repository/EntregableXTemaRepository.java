package pucp.edu.pe.sgta.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import pucp.edu.pe.sgta.model.EntregableXTema;

public interface EntregableXTemaRepository extends CrudRepository<EntregableXTema, Long> {

    @Query("SELECT e FROM EntregableXTema e JOIN FETCH e.entregable WHERE e.tema.id = :temaId")
    List<EntregableXTema> findByTemaIdWithEntregable(Integer temaId);
}
