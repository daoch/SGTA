package pucp.edu.pe.sgta.service.inter;

import org.springframework.data.domain.Page;
import pucp.edu.pe.sgta.dto.*;
import pucp.edu.pe.sgta.dto.asesores.*;
import org.springframework.web.multipart.MultipartFile;
import pucp.edu.pe.sgta.util.RolEnum;
import pucp.edu.pe.sgta.util.TipoUsuarioEnum;

import java.util.Collection;
import java.util.List;
import java.util.NoSuchElementException;

public interface UsuarioService {

    // Define the methods that you want to implement in the service
    // For example:
    void createUsuario(UsuarioRegistroDto usuarioDto);

    UsuarioDto findUsuarioById(Integer id);

    List<UsuarioDto> findAllUsuarios();

    void updateUsuario(Integer id, UsuarioRegistroDto usuarioDto);

    void deleteUsuario(Integer id);

    void reactivarUsuario(Integer id);

    List<UsuarioDto> findUsuariosByRolAndCarrera(String tipoUsuario, Integer idCarrera, String cadenaBusqueda);

    PerfilAsesorDto getPerfilAsesor(Integer id);

    void updatePerfilAsesor(PerfilAsesorDto perfilAsesorDto);

    /**
     * HU01: Asigna el rol de Asesor a un usuario que debe ser profesor
     *
     * @param userId El ID del usuario al que se asignará el rol
     * @throws NoSuchElementException   Si el usuario o el rol no existen
     * @throws IllegalArgumentException Si el usuario no es profesor
     */
    void assignAdvisorRoleToUser(Integer userId);

    /**
     * HU02: Quita el rol de Asesor a un usuario
     *
     * @param userId El ID del usuario al que se quitará el rol
     * @throws NoSuchElementException   Si el usuario o el rol no existen
     * @throws IllegalArgumentException Si el usuario no tiene el rol asignado
     */
    void removeAdvisorRoleFromUser(Integer userId);

    /**
     * HU03: Asigna el rol de Jurado a un usuario que debe ser profesor
     *
     * @param userId El ID del usuario al que se asignará el rol
     * @throws NoSuchElementException   Si el usuario o el rol no existen
     * @throws IllegalArgumentException Si el usuario no es profesor
     */
    void assignJuryRoleToUser(Integer userId);

    /**
     * HU04: Quita el rol de Jurado a un usuario
     *
     * @param userId El ID del usuario al que se quitará el rol
     * @throws NoSuchElementException   Si el usuario o el rol no existen
     * @throws IllegalArgumentException Si el usuario no tiene el rol asignado
     */
    void removeJuryRoleFromUser(Integer userId);

    /**
     * HU05: Obtiene la lista de profesores con sus roles asignados
     *
     * @param rolNombre       Nombre del rol por el que filtra (puede ser "Todos")
     * @param terminoBusqueda Término para buscar en nombre, correo o código
     * @param idCognito      ID del cognito del usuario que realiza la búsqueda
     * @return Lista de usuarios con información de sus roles
     */
    List<UsuarioConRolDto> getProfessorsWithRoles(String rolNombre, String terminoBusqueda, String idCognito);

    List<UsuarioDto> getAsesoresBySubArea(Integer idSubArea);

    UsuarioDto findUsuarioByCodigo(String codigoPucp);

    void uploadFoto(Integer idUsuario, MultipartFile file);

    UsuarioFotoDto getUsuarioFoto(Integer id);

    Integer getIdByCorreo(String correo);

    Page<PerfilAsesorDto> getDirectorioDeAsesoresPorFiltros(FiltrosDirectorioAsesores filtros, Integer pageNumber, Boolean ascending);

    void procesarArchivoUsuarios(MultipartFile archivo, UsuarioRegistroDto datosExtra) throws Exception;

    UsuarioDto findByCognitoId(String cognitoId) throws NoSuchElementException;

    void validarTipoUsuarioRolUsuario(String cognitoId,List<TipoUsuarioEnum> tipos, RolEnum rol);

    List<DocentesDTO> getProfesores();

    AlumnoTemaDto getAlumnoTema(String idAlumno);

    List<AlumnoReporteDto> findByStudentsForReviewer(String idUsuario, String cadenaBusqueda);

    PerfilUsuarioDto getPerfilUsuario(String cognitoId);

    void updatePerfilUsuario(PerfilUsuarioDto dto);

    String obtenerCognitoPorId(Integer idUsuario);

    Integer obtenerIdUsuarioPorCognito(String cognito);

    List<UsuarioRolRevisorDto> listarRevisoresPorCarrera(Integer carreraId);

    List<PerfilAsesorDto> buscarAsesoresPorCadenaDeBusqueda(String cadena, Integer idUsuario);

    List<UsuarioDto> findAllByIds(Collection<Integer> ids);

}
