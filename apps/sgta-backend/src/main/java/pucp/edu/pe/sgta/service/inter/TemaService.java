package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.*;
import pucp.edu.pe.sgta.dto.asesores.InfoTemaPerfilDto;
import pucp.edu.pe.sgta.dto.asesores.TemaConAsesorDto;

import java.sql.SQLException;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

import pucp.edu.pe.sgta.dto.exposiciones.ExposicionTemaMiembrosDto;
import pucp.edu.pe.sgta.dto.temas.TemasComprometidosDto;
import pucp.edu.pe.sgta.model.Tema;

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
	Integer createTemaPropuesta(TemaDto dto, String idUsuarioCreador, Integer tipoPropuesta);

	void update(TemaDto dto);

	void delete(Integer id);

	Integer createInscripcionTema(TemaDto dto, String idUsuario); // Works for asesor, alumno, coordinador and revisor

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

	List<TemaConAsesorJuradoDTO> listarTemasCicloActualXEtapaFormativa(Integer etapaFormativaId,Integer expoId);

	List<TemaDto> listarPropuestasPorTesista(String tesistaId);

	List<TemaDto> listarPropuestasPorCotesista(String tesistaId);

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

	Integer crearTemaLibre(TemaDto dto, String asesorId);

	TemaDto buscarTemaPorId(Integer idTema) throws SQLException;

	TemaConAsesorDto obtenerTemaActivoPorAlumno(Integer idAlumno);

	void crearSolicitudCambioDeTitulo(String idUsuario,
											String comentario,
											Integer temaId);

	void crearSolicitudCambioDeResumen(String idUsuario,
											String comentario,
											Integer temaId);

	List<TemaDto> listarTemasLibres(String titulo, Integer limit, Integer offset, String usuarioId, Boolean myOwn);

	void postularTemaLibre(Integer temaId, String tesistaId, String comentario);

	void inscribirTemaPreinscrito(Integer temaId, String idUsuario);

	List<TemaDto>  listarPostuladosTemaLibre(String busqueda, String estado, LocalDate fechaLimite,Integer limit,Integer offset,String usuarioId);

	void eliminarPostulacionTemaLibre(Integer temaId, String idUsuario);

	void aceptarPostulacionAlumno(Integer temaId, Integer idTesista, String idAsesor, String comentario);

	void rechazarPostulacionAlumno(Integer temaId, Integer idTesista, String idAsesor, String comentario);

	List<TemaPorAsociarDto> listarTemasPorAsociarPorCarrera(Integer carreraId);

	void asociarTemaACurso(Integer cursoId, Integer temaId);

	List<TemaDto> listarTemasPorUsuarioTituloAreaCarreraEstadoFecha(
        String usuarioCognitoId,
        String titulo,
        Integer areaId,
        Integer carreraId,
        String estadoNombre,
        LocalDate fechaCreacionDesde,
        LocalDate fechaCreacionHasta,
        Integer limit,
        Integer offset
    );

	List<TemaDto> listarTemasFiltradoCompleto(
            String titulo,
            String estadoNombre,
            Integer carreraId,
            Integer areaId,
            String nombreUsuario,
            String primerApellidoUsuario,
            String segundoApellidoUsuario,
            Integer limit,
            Integer offset
    ) ;

	Integer contarPostuladosAlumnosTemaLibreAsesor(
			String busqueda,
			String estado,
			LocalDate fechaLimite,
			String usuarioId
	);

	void guardarSimilitudes(String cognitoId, List<TemaSimilarDto> similitudes);

	Integer createInscripcionTemaV2(TemaDto dto, String idUsuario, Boolean reinscribir);

	List<TemaDto> listarTemasSimilares(Integer temaId);

    /**
     * Lists all finalized temas by calling the stored procedure listar_temas_finalizados()
     *
     * @return List of TemaDto representing finalized temas
     */
    List<TemaDto> listarTemasFinalizados();

	/**
	 * Cuenta los temas comprometidos por un usuario tesista
	 * @param usuarioSubId ID del usuario (cognito sub)
	 * @return Lista de temas comprometidos agrupados por estado
	 */
	List<TemasComprometidosDto> contarTemasComprometidos(String usuarioSubId);

	/**
	 * Acepta o rechaza una propuesta de cotesista para un tema
	 * @param usuarioId ID del usuario (cognito sub)
	 * @param temaId ID del tema
	 * @param action 0 para aceptar, 1 para rechazar
	 * @return Lista de temas comprometidos agrupados por estado
	 */
	void aceptarPropuestaCotesista(Integer temaId, String usuarioId, Integer action);

	void registrarSolicitudesModificacionTema(Integer temaId, String usuarioId, List<Map<String, Object>> solicitudes);

	Integer actualizarTemaLibre(TemaDto dto);

	void reenvioSolicitudAprobacionTema(TemaDto dto, String usuarioId);

	String listarSolicitudesConUsuarios(Integer temaId, int offset, int limit);

	String listarSolicitudesPendientesPorUsuario(String usuarioId, int offset, int limit);

	/**
	 * Creates a new tema from OAI record data with FINALIZADO state
	 * @param temaDto The tema data created from OAI record
	 * @param carreraId The career ID to associate with the tema
	 * @return The ID of the created tema
	 */
	Integer createTemaFromOAI(TemaDto temaDto, Integer carreraId);

	/**
	 * Registra una propuesta de reasignación para una solicitud de cese ya aprobada.
	 * Actualiza la solicitud original con el asesor propuesto y un estado de reasignación.
	 * Notifica al asesor propuesto.
	 *
	 * @param solicitudDeCeseOriginalId El ID de la Solicitud de cese que fue aprobada.
	 * @param nuevoAsesorPropuestoId El ID del Usuario (profesor) que se propone como nuevo asesor.
	 * @param coordinadorCognitoSub El Cognito Sub del coordinador que realiza la propuesta (para auditoría/validación).
	 */
	void proponerReasignacionParaSolicitudCese(
			Integer solicitudDeCeseOriginalId,
			Integer nuevoAsesorPropuestoId,
			String coordinadorCognitoSub
	);

	Tema actualizarTemaYHistorial(Integer temaId,
								  String nuevoEstadoNombre,
								  String comentario);

	String listarSolicitudesPendientesTemaAlumnos(String usuarioId, int offset, int limit);

}
