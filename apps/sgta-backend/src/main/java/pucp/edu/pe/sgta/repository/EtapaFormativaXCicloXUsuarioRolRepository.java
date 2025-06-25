package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.EtapaFormativaXCicloXUsuarioRol;

@Repository
public interface EtapaFormativaXCicloXUsuarioRolRepository extends JpaRepository<EtapaFormativaXCicloXUsuarioRol, Integer> {

    @Query(value = "SELECT asignar_revisor(:cursoId, :revisorId)", nativeQuery = true)
    void asignarRevisor(Integer cursoId, Integer revisorId);

    @Query(value = "SELECT asociar_temas_a_revisor(:cursoId, :revisorId)", nativeQuery = true)
    void asociarTemasARevisor(@Param("cursoId") Integer cursoId, @Param("revisorId") Integer revisorId);
}
