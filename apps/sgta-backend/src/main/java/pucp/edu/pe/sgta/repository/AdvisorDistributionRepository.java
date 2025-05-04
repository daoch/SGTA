package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.Usuario;

import java.util.List;

@Repository
public interface AdvisorDistributionRepository extends JpaRepository<Usuario, Integer> {
    
    @Query(value = "SELECT * FROM get_advisor_distribution()", nativeQuery = true)
    List<Object[]> getAdvisorDistribution();
} 