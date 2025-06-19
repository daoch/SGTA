package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.EtapaFormativaXCicloXTema;

import java.util.List;
import java.util.Set;

@Repository
public interface EtapaFormativaXCicloXTemaRepository extends JpaRepository<EtapaFormativaXCicloXTema,Integer> {
    List<EtapaFormativaXCicloXTema> findByTemaIdAndActivoTrue(Integer temaId);
    List<EtapaFormativaXCicloXTema> findByTema_IdIn(Set<Integer> temaIds);
}
