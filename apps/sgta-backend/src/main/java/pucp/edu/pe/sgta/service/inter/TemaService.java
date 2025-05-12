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

	void createInscripcionTema(TemaDto dto, Integer idUsuarioCreador); //Works for asesor, alumno, coordinador and revisor

	List<TemaDto> listarTemasPropuestosAlAsesor(Integer asesorId);

	List<TemaDto> listarTemasPropuestosPorSubAreaConocimiento(List<Integer> subareaIds,Integer asesorId);

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

	List<TemaDto> listarPostulacionesDirectasAMisPropuestas(Integer tesistaId);

	List<TemaDto> listarPostulacionesGeneralesAMisPropuestas(Integer tesistaId);


	List<InfoTemaPerfilDto> listarTemasAsesorInvolucrado(Integer idAsesor);

	void eliminarPropuestasTesista(Integer idUsuario);

	void eliminarPostulacionesTesista(Integer idUsuario);

}
