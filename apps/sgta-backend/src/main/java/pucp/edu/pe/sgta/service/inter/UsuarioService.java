package pucp.edu.pe.sgta.service.inter;

import org.springframework.web.multipart.MultipartFile;
import pucp.edu.pe.sgta.dto.asesores.PerfilAsesorDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.dto.asesores.UsuarioFotoDto;

import java.io.IOException;
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

	UsuarioDto findUsuarioByCodigo(String codigoPucp);

    void uploadFoto(Integer idUsuario, MultipartFile file);

	UsuarioFotoDto getUsuarioFoto(Integer id);

	Integer getIdByCorreo(String correo);
}
