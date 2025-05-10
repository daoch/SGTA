package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pucp.edu.pe.sgta.model.EtapaFormativaXCiclo;
import org.springframework.stereotype.Repository;

@Repository
public interface EtapaFormativaXCicloRepository extends JpaRepository<EtapaFormativaXCiclo, Integer> {

}
