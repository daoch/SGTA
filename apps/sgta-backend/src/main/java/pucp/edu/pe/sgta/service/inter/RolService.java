package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.QueryRolResponse;
import pucp.edu.pe.sgta.dto.RolDto;

import java.util.List;
import java.util.Optional;

public interface RolService {

	/**
	 * Obtiene todos los roles del sistema
	 * @return Lista de roles
	 */
	List<RolDto> findAllRoles();

	/**
	 * Obtiene los roles del sistema con paginación
	 * @param page Número de página (comienza en 0)
	 * @param size Tamaño de la página
	 * @param nombre Filtro opcional por nombre
	 * @return Respuesta paginada con los roles encontrados
	 */
	QueryRolResponse findRolesPaginated(int page, int size, String nombre);

	/**
	 * Busca un rol por su ID
	 * @param id ID del rol a buscar
	 * @return El rol si existe
	 */
	Optional<RolDto> findRolById(Integer id);

	/**
	 * Busca un rol por su nombre
	 * @param nombre Nombre del rol a buscar
	 * @return El rol si existe
	 */
	Optional<RolDto> findRolByNombre(String nombre);

}