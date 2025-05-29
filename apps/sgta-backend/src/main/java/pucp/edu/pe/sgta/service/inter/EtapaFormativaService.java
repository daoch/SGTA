package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.*;

import java.util.List;

import pucp.edu.pe.sgta.dto.*;


public interface EtapaFormativaService {

    List<EtapaFormativaDto> getAll();

    EtapaFormativaDto findById(Integer id);

    /*
     * Crea una nueva Etapa Formativa ligada únicamente a una Carrera.
     * 
     * @param dto datos de la etapa (nombre, creditaje, duración, carreraId)
     * 
     * @return DTO con el ID generado y datos guardados
     */
    EtapaFormativaDto create(EtapaFormativaDto dto);

    EtapaFormativaDto update(EtapaFormativaDto dto);

    void delete(Integer id);

    List<EtapaFormativaNombreDTO> findToInitializeByCoordinador(Integer id);

    List<EtapaFormativaDto> findAllActivas();

    List<EtapaFormativaDto> findAllActivasByCoordinador(Integer coordinadorId);

    List<EtapaFormativaNombreDTO> findAllActivasNombre();

    /**
     * Obtiene un listado simple de todas las etapas formativas
     * 
     * @return Lista de etapas formativas con nombre, carrera y estado
     */
    List<EtapaFormativaListadoDto> getSimpleList();

    /**
     * Obtiene el detalle completo de una etapa formativa incluyendo su historial de
     * ciclos
     * 
     * @param id ID de la etapa formativa
     * @return Detalle completo de la etapa formativa
     */
    EtapaFormativaDetalleDto getDetalleById(Integer id);
    /*
     * // Crea el vínculo entre una etapa Formativa y un Ciclo nuevo
     * void vincularACiclo(Integer etapaFormativaId, Integer cicloId);
     * 
     * // Marca el vínculo existente como FINALIZADO
     * void finalizar(Integer etapaFormativaXCicloId);
     * 
     * // Reactiva un vínculo finalizado (vuelve a EN_CURSO)
     * void reactivar(Integer etapaFormativaXCicloId);
     * 
     * // Devuelve todo el historial de vínculos de una etapa formativa
     * List<EtapaFormativaXCicloDto> findHistorialByEtapaId(Integer
     * etapaFormativaId);
     * 
     */

    Integer getEtapaFormativaIdByExposicionId(Integer exposicionId);

    List<EtapaFormativaAlumnoDto> listarEtapasFormativasPorAlumno(String alumnoId);
}
