package pucp.edu.pe.sgta.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import pucp.edu.pe.sgta.dto.EtapaFormativaDto;
import pucp.edu.pe.sgta.dto.EtapaFormativaNombreDTO;
import pucp.edu.pe.sgta.model.EtapaFormativa;

public interface EtapaFormativaRepository extends JpaRepository<EtapaFormativa, Integer> {

    @Query(value = "SELECT * FROM obtener_etapas_formativas_por_usuario(:usuarioId)", nativeQuery = true)
    List<EtapaFormativaNombreDTO> findByCoordinadorId(@Param("usuarioId") Integer usuarioId);

    @Query(value = "SELECT * FROM listarEtapasFormativasActivas()", nativeQuery = true)
    List<EtapaFormativaDto> findAllActivas();
}
