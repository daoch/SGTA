package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.HistorialTema;

import java.util.List;
import java.util.Optional;

@Repository
public interface HistorialTemaRepository extends JpaRepository<HistorialTema, Integer> {

	public List<HistorialTema> findByTemaId(Integer temaId);

}
