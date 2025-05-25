package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.UsuarioXDocumento;
import java.util.List;

@Repository
public interface UsuarioXDocumentoRepository extends JpaRepository<UsuarioXDocumento, Integer> {

	/**
	 * Listar relaciones usuario-documento para un usuario.
	 */
	List<UsuarioXDocumento> findByUsuarioId(Integer usuarioId);

	/**
	 * Listar relaciones usuario-documento para un documento.
	 */
	List<UsuarioXDocumento> findByDocumentoId(Integer documentoId);

}
