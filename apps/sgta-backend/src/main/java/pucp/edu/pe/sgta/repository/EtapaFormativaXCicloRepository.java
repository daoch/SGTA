package pucp.edu.pe.sgta.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import pucp.edu.pe.sgta.model.EtapaFormativaXCiclo;
import org.springframework.stereotype.Repository;


@Repository
public interface EtapaFormativaXCicloRepository extends JpaRepository<EtapaFormativaXCiclo, Integer> {

    List<EtapaFormativaXCiclo> findAllByEtapaFormativa_Carrera_IdAndActivoTrue(Integer id);

    List<EtapaFormativaXCiclo> findAllByEtapaFormativa_Carrera_IdAndCiclo_IdAndActivoTrue(Integer id, Integer cicloId);

    // Método para obtener todas las etapas formativas por carrera
    //List<EtapaFormativaXCiclo> findAllBy_Carrera_IdAndActivoTrue(Integer id);
}
