package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pucp.edu.pe.sgta.model.Usuario;

import java.util.List;

@Repository
public interface JurorDistributionRepository extends JpaRepository<Usuario, Long> {
    
    //@Query(value = "SELECT * FROM get_juror_distribution()", nativeQuery = true)
    //List<Object[]> getJurorDistribution();
} 