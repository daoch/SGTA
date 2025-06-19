package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.VersionXDocumento;
import java.util.List;
import java.util.Optional;

@Repository
public interface VersionXDocumentoRepository extends JpaRepository<VersionXDocumento, Integer> {
    /**
     * Listar versiones asociadas a un documento.
     */
    List<VersionXDocumento> findByDocumentoId(Integer documentoId);
    Optional<VersionXDocumento>
    findTopByEntregableXTema_EntregableXTemaIdOrderByFechaCreacionDesc(Integer entregableXTemaId);
    

}