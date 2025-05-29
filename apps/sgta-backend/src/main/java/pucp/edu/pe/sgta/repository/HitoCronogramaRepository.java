package pucp.edu.pe.sgta.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import pucp.edu.pe.sgta.model.Usuario;

@Repository
public interface HitoCronogramaRepository extends JpaRepository<Usuario, Integer> {
    @Query(value = "SELECT t.hito_id, t.nombre, t.descripcion, " +
           "CAST(t.fecha_inicio AS timestamp), " +
           "CAST(t.fecha_fin AS timestamp), " +
           "t.entregable_envio_estado, t.entregable_actividad_estado, " +
           "t.es_evaluable, t.tema_id, t.tema_titulo " +
           "FROM listar_hitos_cronograma_tesista(:tesistaId) t", nativeQuery = true)
    List<Object[]> getHitosCronogramaTesista(@Param("tesistaId") Integer tesistaId);
} 