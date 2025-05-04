package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pucp.edu.pe.sgta.model.Usuario;

import java.util.List;

@Repository
public interface AdvisorPerformanceRepository extends JpaRepository<Usuario, Long> {
    
    //@Query(value = "SELECT * FROM get_advisor_performance()", nativeQuery = true)
    //List<Object[]> getAdvisorPerformance();
} 