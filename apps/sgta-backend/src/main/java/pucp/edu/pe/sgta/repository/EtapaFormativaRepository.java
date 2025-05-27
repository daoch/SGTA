package pucp.edu.pe.sgta.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

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

    @Query(value = "SELECT * FROM obtener_etapas_formativas_por_tema_simple(:temaId)", nativeQuery = true)
    List<Object[]> obtenerEtapasFormativasPorTemaSimple(@Param("temaId") Integer temaId);

    @Query(value = "SELECT * FROM obtener_exposiciones_por_etapa_formativa_por_tema(:etapaFormativaId, :temaId)", nativeQuery = true)
    List<Object[]> obtenerExposicionesPorEtapaFormativaPorTemaId(@Param("etapaFormativaId") Integer etapaFormativaId,
            @Param("temaId") Integer temaId);

    /**
     * Actualiza explícitamente el campo duracion_exposicion usando un intervalo
     * PostgreSQL
     */
    @Modifying
    @Transactional
    @Query(value = "UPDATE etapa_formativa SET duracion_exposicion = CAST(:duracion AS interval) WHERE etapa_formativa_id = :id", nativeQuery = true)
    void updateDuracionExposicion(@Param("id") Integer id, @Param("duracion") String duracion);

    /**
     * Función SQL para obtener el listado simple de etapas formativas
     */
    @Query(value = "SELECT * FROM listar_etapas_formativas_simple()", nativeQuery = true)
    List<Object[]> findAllForSimpleList();

    /**
     * Función SQL para obtener el detalle completo de una etapa formativa
     */
    @Query(value = "SELECT * FROM obtener_detalle_etapa_formativa(:etapaId)", nativeQuery = true)
    Object getEtapaFormativaDetalleFunction(@Param("etapaId") Integer etapaId);

    /**
     * Función SQL para obtener el historial de ciclos de una etapa formativa
     */
    @Query(value = "SELECT * FROM obtener_historial_ciclos_etapa_formativa(:etapaId)", nativeQuery = true)
    List<Object[]> getHistorialCiclosEtapaFormativa(@Param("etapaId") Integer etapaId);
}
