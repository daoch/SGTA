package pucp.edu.pe.sgta.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import pucp.edu.pe.sgta.model.Usuario;

@Repository
public interface TesistasPorAsesorRepository extends JpaRepository<Usuario, Integer> {
    @Query(value = "SELECT t.tema_id, t.tesista_id, t.nombres, t.primer_apellido, t.segundo_apellido, " +
           "t.correo_electronico, t.titulo_tema, t.etapa_formativa_nombre, t.carrera, " +
           "t.entregable_actual_id, t.entregable_actual_nombre, t.entregable_actual_descripcion, " +
           "CAST(t.entregable_actual_fecha_inicio AS timestamp), " +
           "CAST(t.entregable_actual_fecha_fin AS timestamp), " +
           "t.entregable_actual_estado, t.entregable_envio_estado, " +
           "CAST(t.entregable_envio_fecha AS timestamp) " +
           "FROM listar_tesistas_por_asesor(:asesorId) t", nativeQuery = true)
    List<Object[]> getTesistasPorAsesor(@Param("asesorId") Integer asesorId);
} 