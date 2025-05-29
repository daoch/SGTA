package pucp.edu.pe.sgta.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import pucp.edu.pe.sgta.model.Usuario;

@Repository
public interface DetalleTesistaRepository extends JpaRepository<Usuario, Integer> {
    @Query(value = "SELECT t.tesista_id, t.nombres, t.primer_apellido, t.segundo_apellido, " +
           "t.correo_electronico, t.nivel_estudios, t.codigo_pucp, t.tema_id, t.titulo_tema, " +
           "t.resumen_tema, t.metodologia, t.objetivos, t.area_conocimiento, t.sub_area_conocimiento, " +
           "t.asesor_nombre, t.asesor_correo, t.coasesor_nombre, t.coasesor_correo, t.ciclo_id, " +
           "t.ciclo_nombre, t.fecha_inicio_ciclo, t.fecha_fin_ciclo, t.etapa_formativa_id, " +
           "t.etapa_formativa_nombre, t.fase_actual, t.entregable_id, t.entregable_nombre, " +
           "t.entregable_actividad_estado, t.entregable_envio_estado, " +
           "CAST(t.entregable_fecha_inicio AS timestamp), " +
           "CAST(t.entregable_fecha_fin AS timestamp) " +
           "FROM obtener_detalle_tesista(:tesistaId) t", nativeQuery = true)
    List<Object[]> getDetalleTesista(@Param("tesistaId") Integer tesistaId);
} 