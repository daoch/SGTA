package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.RevisionDocumento;
import pucp.edu.pe.sgta.util.EstadoRevision;

import java.util.List;

@Repository
public interface RevisionDocumentoRepository extends JpaRepository<RevisionDocumento, Integer> {

    List<RevisionDocumento> findByUsuarioId(Integer usuarioId);
    
    List<RevisionDocumento> findByVersionDocumentoId(Integer versionDocumentoId);
    
    List<RevisionDocumento> findByEstadoRevision(EstadoRevision estadoRevision);
    
    List<RevisionDocumento> findByVersionDocumentoDocumentoId(Integer documentoId);
    
    @Query(value = "SELECT * FROM listar_revisiones_por_documento(:documentoId)", nativeQuery = true)
    List<Object[]> listarRevisionesPorDocumento(@Param("documentoId") Integer documentoId);
} 