package pucp.edu.pe.sgta.service.inter;

import org.springframework.web.multipart.MultipartFile;
import pucp.edu.pe.sgta.dto.PerfilAsesorDto;
import pucp.edu.pe.sgta.dto.UserInfoDTO;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import java.util.List;
import java.util.Optional;

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

	Optional<UserInfoDTO> obtenerInfoPorCorreo(String correo);

	void procesarArchivoUsuarios(MultipartFile archivo) throws Exception;
}
