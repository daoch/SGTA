package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.RevisionDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.model.RevisionDocumento;
import pucp.edu.pe.sgta.dto.RevisionDocumentoAsesorDto;
import pucp.edu.pe.sgta.dto.RevisionDocumentoRevisorDto;
import pucp.edu.pe.sgta.util.EstadoRevision;

import java.util.List;

public interface RevisionDocumentoService {
    
    List<RevisionDocumento> findByUsuarioId(Integer usuarioId);
    
    List<RevisionDocumento> findByVersionDocumentoId(Integer versionDocumentoId);
    
    List<RevisionDocumento> findByEstadoRevision(EstadoRevision estadoRevision);
    
    List<RevisionDocumento> findByVersionDocumentoDocumentoId(Integer documentoId);
    
    /**
     * Obtiene todas las revisiones con la información completa para el endpoint
     * @return Lista de DTOs con la información de revisiones
     */
    List<RevisionDto> findAllRevisionesCompletas();
    
    /**
     * Obtiene todas las revisiones asignadas a un revisor específico
     * @param revisorId ID del usuario revisor
     * @return Lista de DTOs con la información de revisiones asignadas al revisor
     */
    List<RevisionDto> findRevisionesByRevisorId(Integer revisorId);

    List<RevisionDocumentoAsesorDto> listarRevisionDocumentosPorAsesor(String asesorId);

    List<RevisionDocumentoRevisorDto> listarRevisionDocumentosPorRevisor(String revisorId);

    void actualizarEstadoRevision(Integer revisionId, String nuevoEstado);
    RevisionDocumentoAsesorDto obtenerRevisionDocumentoPorId(Integer revisionId);

    void crearRevisiones(int entregableXTemaId);
    void crearRevisionesJurado(int entregableXTemaId);

    void crearRevisionesRevisores(int entregableXTemaId);

    List<UsuarioDto> getStudentsByRevisor(Integer revisionId);

    List<RevisionDocumentoAsesorDto> listarRevisionDocumentosPorJurado(String juradoId);
    void actualizarEstadoTodosRevisiones(Integer revisionId, String nuevoEstado);
}