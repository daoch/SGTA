package pucp.edu.pe.sgta.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import pucp.edu.pe.sgta.model.EtapaFormativaXSalaExposicion;

public interface EtapaFormativaXSalaExposicionRepository extends JpaRepository<EtapaFormativaXSalaExposicion, Integer> {

        @Query(value = "SELECT * FROM listar_etapa_formativa_x_sala_exposicion(:efId)", nativeQuery = true)
        List<Object[]> listarEtapasFormativasXSalaExposicion(
                        @Param("efId") Integer etapaFormativaId);
}
