package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import pucp.edu.pe.sgta.model.Usuario;

@Repository
public interface EntregablesCriteriosRepository extends JpaRepository<Usuario, Integer> {
    
    @Query(value = "SELECT * FROM obtener_entregables_con_criterios(:usuarioId)", nativeQuery = true)
    List<Object[]> getEntregablesConCriterios(@Param("usuarioId") Integer usuarioId);
} 