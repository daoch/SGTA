package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.SubAreaConocimiento;

import java.util.List;

@Repository
public interface TopicAreaStatsRepository extends JpaRepository<SubAreaConocimiento, Integer> {
    
    @Query(value = "SELECT * FROM get_topic_area_stats_by_user(:usuarioId)", nativeQuery = true)
    List<Object[]> getTopicAreaStatsByUser(@Param("usuarioId") Integer usuarioId);

    @Query(value = "SELECT * FROM get_topic_area_stats_by_user_and_ciclo(:usuarioId, :cicloNombre)", nativeQuery = true)
    List<Object[]> getTopicAreaStatsByUserAndCiclo(@Param("usuarioId") Integer usuarioId, @Param("cicloNombre") String cicloNombre);
} 