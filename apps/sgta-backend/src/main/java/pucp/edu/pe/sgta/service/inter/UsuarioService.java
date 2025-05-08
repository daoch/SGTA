package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.PerfilAsesorDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import java.util.List;
import java.util.NoSuchElementException;

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

	/**
	 * Asigna el rol de Asesor a un usuario que debe ser profesor
	 * 
	 * @param userId El ID del usuario al que se asignará el rol
	 * @throws NoSuchElementException Si el usuario o el rol no existen
	 * @throws IllegalArgumentException Si el usuario no es profesor
	 */
	void assignAdvisorRoleToUser(Integer userId);
}
