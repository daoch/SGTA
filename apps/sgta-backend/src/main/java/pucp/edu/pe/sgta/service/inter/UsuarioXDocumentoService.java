package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.UsuarioDocumentoDto;
import java.util.List;

public interface UsuarioXDocumentoService {

	UsuarioDocumentoDto asignarDocumentoAUsuario(Integer usuarioId, Integer documentoId, String permiso);

	List<UsuarioDocumentoDto> listarDocumentosPorUsuario(Integer usuarioId);

	List<UsuarioDocumentoDto> listarUsuariosPorDocumento(Integer documentoId);

}