package pucp.edu.pe.sgta.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.support.JpaRepositoryFactory;
import pucp.edu.pe.sgta.model.UnidadAcademica;


@Repository
public interface UnidadAcademicaRepository extends JpaRepository<UnidadAcademica, Integer> {


}