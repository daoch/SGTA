package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.HistorialTema;

import java.util.List;

@Repository
public interface HistorialTemaRepository extends JpaRepository<HistorialTema, Integer> {
    public List<HistorialTema> findByTemaId(Integer temaId);

    @Query(value = "SELECT * FROM listar_historial_tema(:temaId)", nativeQuery = true)
    List<HistorialTema> findActivoByTemaId(@Param("temaId") Integer temaId);

    @Query(
      value = "SELECT * FROM listar_historial_tema_completo(:temaId)",
      nativeQuery = true
    )
    List<HistorialTema> findCompletoByTemaId(@Param("temaId") Integer temaId);
}
