package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.Entregable;

import java.util.List;

@Repository
public interface EntregableRepository extends JpaRepository<Entregable, Integer> {
//    List<Entregable> findByEtapaFormativaId(Integer idEtapaFormativa);
}
