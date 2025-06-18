package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.AreaConocimientoDto;
import pucp.edu.pe.sgta.dto.asesores.InfoAreaConocimientoDto;

import java.util.List;

public interface AreaConocimientoService {

	AreaConocimientoDto create(AreaConocimientoDto dto, String idCognito);

	void update(AreaConocimientoDto dto);

	void delete(Integer id);

	List<AreaConocimientoDto> getAll();

	List<AreaConocimientoDto> getAllByCarrera(String idCognito);

	List<AreaConocimientoDto> getAllByIdExpo(Integer idExpo);

	List<AreaConocimientoDto> getAllByTemaId(Integer temaId);

	AreaConocimientoDto findById(Integer id);

	List<AreaConocimientoDto> listarPorUsuario(Integer usuarioId);

	List<AreaConocimientoDto> listarPorUsuarioSub(String usuarioId);

	List<InfoAreaConocimientoDto> listarInfoPorNombre(String nombre);

	List<InfoAreaConocimientoDto> listarPorCarrerasUsuarioParaPerfil(Integer idUsuario);
}
