package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.asesores.FiltrosDirectorioAsesores;
import pucp.edu.pe.sgta.dto.asesores.PerfilAsesorDto;
import pucp.edu.pe.sgta.dto.asesores.UsuarioFotoDto;
import org.springframework.web.multipart.MultipartFile;
import pucp.edu.pe.sgta.dto.UserInfoDTO;
import pucp.edu.pe.sgta.dto.AlumnoTemaDto;
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
     * HU01: Asigna el rol de Asesor a un usuario que debe ser profesor
     *
     * @param userId El ID del usuario al que se asignará el rol
     * @throws NoSuchElementException Si el usuario o el rol no existen
     * @throws IllegalArgumentException Si el usuario no es profesor
     */
    void assignAdvisorRoleToUser(Integer userId);

    /**
     * HU02: Quita el rol de Asesor a un usuario
     *
     * @param userId El ID del usuario al que se quitará el rol
     * @throws NoSuchElementException Si el usuario o el rol no existen
     * @throws IllegalArgumentException Si el usuario no tiene el rol asignado
     */
    void removeAdvisorRoleFromUser(Integer userId);

    /**
     * HU03: Asigna el rol de Jurado a un usuario que debe ser profesor
     *
     * @param userId El ID del usuario al que se asignará el rol
     * @throws NoSuchElementException Si el usuario o el rol no existen
     * @throws IllegalArgumentException Si el usuario no es profesor
     */
    void assignJuryRoleToUser(Integer userId);

    /**
     * HU04: Quita el rol de Jurado a un usuario
     *
     * @param userId El ID del usuario al que se quitará el rol
     * @throws NoSuchElementException Si el usuario o el rol no existen
     * @throws IllegalArgumentException Si el usuario no tiene el rol asignado
     */
    void removeJuryRoleFromUser(Integer userId);

    /**
     * HU05: Obtiene la lista de profesores con sus roles asignados
     *
     * @param rolNombre Nombre del rol por el que filtrar (puede ser "Todos")
     * @param terminoBusqueda Término para buscar en nombre, correo o código
     * @return Lista de usuarios con información de sus roles
     */
    List<UsuarioDto> getProfessorsWithRoles(String rolNombre, String terminoBusqueda);

    List<UsuarioDto> getAsesoresBySubArea(Integer idSubArea);

	UsuarioDto findUsuarioByCodigo(String codigoPucp);

    void uploadFoto(Integer idUsuario, MultipartFile file);

	UsuarioFotoDto getUsuarioFoto(Integer id);

	Integer getIdByCorreo(String correo);

    List<PerfilAsesorDto> getDirectorioDeAsesoresPorFiltros(FiltrosDirectorioAsesores filtros);

	void procesarArchivoUsuarios(MultipartFile archivo) throws Exception;

    AlumnoTemaDto getAlumnoTema(Integer idAlumno);
}
