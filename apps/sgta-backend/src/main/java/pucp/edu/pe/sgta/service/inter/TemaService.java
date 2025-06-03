package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.asesores.InfoTemaPerfilDto;
import pucp.edu.pe.sgta.dto.asesores.TemaConAsesorDto;
import pucp.edu.pe.sgta.dto.SubAreaConocimientoDto;
import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.dto.TemaConAsesorJuradoDTO;
import java.sql.SQLException;
import java.util.List;
import pucp.edu.pe.sgta.dto.exposiciones.ExposicionTemaMiembrosDto;

public interface TemaService {
	List<TemaDto> getAll();

	TemaDto findById(Integer id);

	List<TemaDto> findByUsuario(Integer idUsuario); // Works for asesor, alumno, coordinador and revisor

	/**
	 *
	 *
	 * @param dto
	 * @param idUsuarioCreador: tesista id
	 * @param tipoPropuesta:    0 for general, 1 for direct
	 */
	void createTemaPropuesta(TemaDto dto, String idUsuarioCreador, Integer tipoPropuesta);

	void update(TemaDto dto);

	void delete(Integer id);

	void createInscripcionTema(TemaDto dto, String idUsuario); // Works for asesor, alumno, coordinador and revisor

	List<TemaDto> listarTemasPropuestosAlAsesor(String asesorId, String titulo, Integer limit, Integer offset);

	List<TemaDto> listarTemasPropuestosPorSubAreaConocimiento(
			List<Integer> subareaIds,
			String asesorId,
			String titulo,
			Integer limit,
			Integer offset);

	void postularAsesorTemaPropuestoGeneral(Integer alumnoId, String asesorId, Integer temaId, String comentario);

	void enlazarTesistasATemaPropuestDirecta(Integer[] usuariosId, Integer temaId, String profesorId,
			String comentario);

	List<TemaDto> listarTemasPorUsuarioRolEstado(String usuarioId,
			String rolNombre,
			String estadoNombre, Integer limit, Integer offset);

	List<UsuarioDto> listarUsuariosPorTemaYRol(Integer temaId,
			String rolNombre);

	List<SubAreaConocimientoDto> listarSubAreasPorTema(Integer temaId);

	List<TemaDto> listarTemasPorUsuarioEstadoYRol(String asesorId, String rolNombre, String estadoNombre, Integer limit, Integer offset);

	void rechazarTemaPropuestaDirecta(Integer alumnoId, String comentario, Integer temaId);

	List<TemaConAsesorJuradoDTO> listarTemasCicloActualXEtapaFormativa(Integer etapaFormativaId);

	List<TemaDto> listarPropuestasPorTesista(String tesistaId);

	List<TemaDto> listarPostulacionesAMisPropuestas(String tesistaId, Integer tipoPropuesta);

	List<InfoTemaPerfilDto> listarTemasAsesorInvolucrado(Integer idAsesor);

	void eliminarPropuestasTesista(Integer idUsuario);

	void eliminarPostulacionesTesista(Integer idUsuario);

	void rechazarPostulacionAPropuestaGeneral(Integer idTema, Integer idAsesor, String idTesista);

	void aprobarPostulacionAPropuestaGeneral(Integer idTema, Integer idAsesor, String idTesista);

	List<TemaDto> listarTemasPorEstadoYCarrera(String estadoNombre, Integer carreraId, Integer limit, Integer offset);

	void cambiarEstadoTemaCoordinador(Integer temaId, String nuevoEstadoNombre, String usuarioId, String comentario);

	List<ExposicionTemaMiembrosDto> listarExposicionXTemaId(Integer temaId);

	void updateTituloResumenTemaSolicitud(Integer idTema, String titulo, String resumen);

	/**
	 * Updates the title of a theme based on a request and handles the request
	 * status.
	 * 
	 * @param solicitudId ID of the request to process
	 * @param titulo      New title for the theme (can be null)
	 * @param respuesta   Response message for the request
	 */
	void updateTituloTemaSolicitud(Integer solicitudId, String titulo, String respuesta);

	/**
	 * Updates the summary of a theme based on a request and handles the request
	 * status.
	 * 
	 * @param solicitudId ID of the request to process
	 * @param resumen     New summary for the theme (can be null)
	 * @param respuesta   Response message for the request
	 */
	void updateResumenTemaSolicitud(Integer solicitudId, String resumen, String respuesta);

	void eliminarTemaCoordinador(Integer temaId, String usuarioId);

	void crearTemaLibre(TemaDto dto, String asesorId);

	TemaDto buscarTemaPorId(Integer idTema) throws SQLException;

	TemaConAsesorDto obtenerTemaActivoPorAlumno(Integer idAlumno);

	void crearSolicitudCambioDeTitulo(String idUsuario,
											String comentario,
											Integer temaId);

	void crearSolicitudCambioDeResumen(String idUsuario,
											String comentario,
											Integer temaId);
	List<TemaDto> listarTemasLibres(String titulo, Integer limit, Integer offset, String usuarioId);

	void postularTemaLibre(Integer temaId, String tesistaId, String comentario);

	void inscribirTemaPreinscrito(Integer temaId, String idUsuario);
}
