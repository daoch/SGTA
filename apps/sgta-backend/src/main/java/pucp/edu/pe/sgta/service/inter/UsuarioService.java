package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.asesores.PerfilAsesorDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import java.util.List;

public interface UsuarioService {

	// Define the methods that you want to implement in the service
	// For example:
	void createUsuario(UsuarioDto usuarioDto);

	UsuarioDto findUsuarioById(Integer id);

	List<UsuarioDto> findAllUsuarios();

	void updateUsuario(UsuarioDto usuarioDto);

	void deleteUsuario(Integer id);

	List<UsuarioDto> findUsuariosByRolAndCarrera(String tipoUsuario, Integer idCarrera, String cadenaBusqueda);

    PerfilAsesorDto getPerfilAsesor(Integer id);

	void updatePerfilAsesor(PerfilAsesorDto perfilAsesorDto);

	List<UsuarioDto> getAsesoresBySubArea(Integer idSubArea);
}
