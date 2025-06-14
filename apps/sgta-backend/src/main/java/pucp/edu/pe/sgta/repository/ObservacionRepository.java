package pucp.edu.pe.sgta.repository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.Observacion;
import org.springframework.data.jpa.repository.Modifying;
@Repository
public interface ObservacionRepository extends JpaRepository<Observacion, Integer> {
    // Puedes agregar métodos personalizados si los necesitas
    List<Observacion> findByRevisionDocumento_Id(Integer revisionId);
    boolean existsByObservacionId(Integer highlightId);
    @Query(value = "SELECT * FROM obtener_observaciones_por_entregable_y_tema(:entregableId, :temaId)", nativeQuery = true)
    List<Object[]> listarObservacionesPorEntregableYTema(
        @Param("entregableId") Integer entregableId,
        @Param("temaId") Integer temaId
    );
    @Modifying
    @Query("UPDATE Observacion o SET o.corregido = :corregido WHERE o.observacionId = :id")
    void actualizarCorregidoPorId(@Param("id") Integer observacionId, @Param("corregido") boolean corregido);
}