package pucp.edu.pe.sgta.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pucp.edu.pe.sgta.model.EtapaFormativaXCiclo;
import org.springframework.stereotype.Repository;


@Repository
public interface EtapaFormativaXCicloRepository extends JpaRepository<EtapaFormativaXCiclo, Integer> {

    List<EtapaFormativaXCiclo> findAllByEtapaFormativa_Carrera_IdAndActivoTrue(Integer id);

    List<EtapaFormativaXCiclo> findAllByEtapaFormativa_Carrera_IdAndCiclo_IdAndActivoTrue(Integer id, Integer cicloId);

    // Método para obtener todas las etapas formativas por carrera
    //List<EtapaFormativaXCiclo> findAllBy_Carrera_IdAndActivoTrue(Integer id);

    @Query(value = "SELECT * FROM listar_etapas_formativas_x_ciclo_x_carrera(:carreraId)", nativeQuery = true)
    List<Object[]> listarEtapasFormativasXCicloXCarrera(Integer carreraId);

    @Query(value = "SELECT * FROM listar_etapa_formativa_x_ciclo_x_id(:etapaXCicloId)", nativeQuery = true)
    List<Object[]> getEtapaFormativaXCicloByEtapaId(Integer etapaXCicloId);

    @Query(value = "SELECT * FROM listar_etapas_formativas_x_ciclo_tesista(:usuarioId)", nativeQuery = true)
    List<Object[]> listarEtapasFormativasXCicloTesista(Integer usuarioId);

}
