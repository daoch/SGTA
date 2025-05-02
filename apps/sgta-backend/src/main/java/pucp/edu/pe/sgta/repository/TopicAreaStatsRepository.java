package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.SubAreaConocimiento;

import java.util.List;

@Repository
public interface TopicAreaStatsRepository extends JpaRepository<SubAreaConocimiento, Integer> {
    
    @Query(value = """
            SELECT ac.nombre as area_name, COUNT(DISTINCT t.tema_id) as topic_count
            FROM area_conocimiento ac
            INNER JOIN sub_area_conocimiento sac ON sac.area_conocimiento_id = ac.area_conocimiento_id
            INNER JOIN sub_area_conocimiento_tema sat ON sat.sub_area_conocimiento_id = sac.sub_area_conocimiento_id
            INNER JOIN tema t ON t.tema_id = sat.tema_id
            INNER JOIN usuario_tema ut ON ut.tema_id = t.tema_id
            WHERE ut.usuario_id = :usuarioId
            AND t.activo = true
            AND ac.activo = true
            AND sac.activo = true
            GROUP BY ac.nombre
            ORDER BY topic_count DESC
            """, nativeQuery = true)
    List<Object[]> getTopicAreaStatsByUser(@Param("usuarioId") Integer usuarioId);
} 