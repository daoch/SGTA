package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.RevisionXDocumento;
import java.util.List;

@Repository
public interface RevisionXDocumentoRepository extends JpaRepository<RevisionXDocumento, Integer> {
    /**
     * Listar revisiones asociadas a una versión de documento.
     */
    List<RevisionXDocumento> findByVersionDocumentoId(Integer versionDocumentoId);

    /**
     * Listar revisiones hechas por un usuario.
     */
    List<RevisionXDocumento> findByUsuarioId(Integer usuarioId);
}