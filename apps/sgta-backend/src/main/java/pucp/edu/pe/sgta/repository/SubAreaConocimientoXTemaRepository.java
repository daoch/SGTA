package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.SubAreaConocimientoXTema;

@Repository
public interface SubAreaConocimientoXTemaRepository extends JpaRepository<SubAreaConocimientoXTema, Integer> {

}
