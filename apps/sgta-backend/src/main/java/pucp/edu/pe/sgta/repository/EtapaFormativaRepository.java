package pucp.edu.pe.sgta.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import pucp.edu.pe.sgta.dto.EtapaFormativaNombreDTO;
import pucp.edu.pe.sgta.model.EtapaFormativa;

public interface EtapaFormativaRepository extends JpaRepository<EtapaFormativa, Integer> {

    @Query(value = "SELECT * FROM get_etapa_formativa_by_id(:id)", nativeQuery = true)
    Object getEtapaFormativaByIdFunction(@Param("id") Integer id);

    @Query(value = "SELECT * FROM obtener_etapas_formativas_por_usuario(:usuarioId)", nativeQuery = true)
    List<EtapaFormativaNombreDTO> findToInitializeByCoordinador(@Param("usuarioId") Integer usuarioId);

    @Query(value = "SELECT * FROM listaretapasformativasactivas()", nativeQuery = true)
    List<Object[]> findAllActivas();

    @Query(value = "SELECT * FROM listar_etapas_formativas_activas_by_coordinador(:coordinadorId)", nativeQuery = true)
    List<Object[]> findAllActivasByCoordinador(@Param("coordinadorId") Integer coordinadorId);

    @Query(value = "SELECT * FROM listar_etapa_formativa_nombre()", nativeQuery = true)
    List<EtapaFormativaNombreDTO> findAllActivasNombre();
}
