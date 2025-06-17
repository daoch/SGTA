package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.EtapaFormativaXCicloXTema;

import java.util.List;

@Repository
public interface EtapaFormativaXCicloXTemaRepository extends JpaRepository<EtapaFormativaXCicloXTema,Integer> {
    List<EtapaFormativaXCicloXTema> findByTemaIdAndActivoTrue(Integer temaId);
}
