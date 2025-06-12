package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.EtapaFormativaXCicloXUsuarioRol;

@Repository
public interface EtapaFormativaXCicloXUsuarioRolRepository extends JpaRepository<EtapaFormativaXCicloXUsuarioRol, Integer> {

    @Query(value = "SELECT asignar_revisor(:cursoId, :revisorId)", nativeQuery = true)
    void asignarRevisor(Integer cursoId, Integer revisorId);
}
