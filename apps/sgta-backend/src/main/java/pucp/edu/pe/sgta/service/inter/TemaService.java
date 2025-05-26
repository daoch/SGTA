package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.asesores.InfoTemaPerfilDto;
import pucp.edu.pe.sgta.dto.SubAreaConocimientoDto;
import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;

import pucp.edu.pe.sgta.dto.TemaConAsesorJuradoDTO;
import java.util.List;

import jakarta.persistence.criteria.CriteriaBuilder.In;

public interface TemaService {
	List<TemaDto> getAll();

	TemaDto findById(Integer id);

	List<TemaDto> findByUsuario(Integer idUsuario); //Works for asesor, alumno, coordinador and revisor

	/**
	 *
	 *
	 * @param dto
	 * @param idUsuarioCreador: tesista id
	 * @param tipoPropuesta: 0 for general, 1 for direct
	 */
	void createTemaPropuesta(TemaDto dto, Integer idUsuarioCreador, Integer tipoPropuesta);

	void update(TemaDto dto);

	void delete(Integer id);

	void createInscripcionTema(TemaDto dto); //Works for asesor, alumno, coordinador and revisor

	List<TemaDto> listarTemasPropuestosAlAsesor(Integer asesorId, String titulo, Integer limit, Integer offset);

	List<TemaDto> listarTemasPropuestosPorSubAreaConocimiento(
			List<Integer> subareaIds,
			Integer asesorId,
			String titulo,
			Integer limit,
			Integer offset
	);

	void postularAsesorTemaPropuestoGeneral(Integer alumnoId, Integer asesorId, Integer temaId, String comentario);

	void enlazarTesistasATemaPropuestDirecta(Integer[] usuariosId, Integer temaId, Integer profesorId, String comentario);

	List<TemaDto> listarTemasPorUsuarioRolEstado(Integer usuarioId,
												 String rolNombre,
												 String estadoNombre);

	List<UsuarioDto> listarUsuariosPorTemaYRol(Integer temaId,
											   String rolNombre);

	List<SubAreaConocimientoDto> listarSubAreasPorTema(Integer temaId);

	List<TemaDto> listarTemasPorUsuarioEstadoYRol(Integer asesorId, String rolNombre, String estadoNombre);

	void rechazarTemaPropuestaDirecta(Integer alumnoId, String comentario, Integer temaId);


	List<TemaConAsesorJuradoDTO> listarTemasCicloActualXEtapaFormativa(Integer etapaFormativaId);

	List<TemaDto> listarPropuestasPorTesista(Integer tesistaId);

	List<TemaDto> listarPostulacionesAMisPropuestas(Integer tesistaId, Integer tipoPropuesta);



	List<InfoTemaPerfilDto> listarTemasAsesorInvolucrado(Integer idAsesor);

	void eliminarPropuestasTesista(Integer idUsuario);

	void eliminarPostulacionesTesista(Integer idUsuario);

	void rechazarPostulacionAPropuestaGeneral(Integer idTema, Integer idAsesor, Integer idTesista);

	void aprobarPostulacionAPropuestaGeneral(Integer idTema, Integer idAsesor, Integer idTesista);
	void updateTituloResumenTemaSolicitud(Integer idTema, String titulo, String resumen);

	/**
	 * Updates the title of a theme based on a request and handles the request status.
	 * 
	 * @param solicitudId ID of the request to process
	 * @param titulo New title for the theme (can be null)
	 * @param respuesta Response message for the request
	 */
	void updateTituloTemaSolicitud(Integer solicitudId, String titulo, String respuesta);

	/**
	 * Updates the summary of a theme based on a request and handles the request status.
	 * 
	 * @param solicitudId ID of the request to process
	 * @param resumen New summary for the theme (can be null) 
	 * @param respuesta Response message for the request
	 */
	void updateResumenTemaSolicitud(Integer solicitudId, String resumen, String respuesta);

}
