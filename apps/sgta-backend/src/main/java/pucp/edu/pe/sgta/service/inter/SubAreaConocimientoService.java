package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.asesores.InfoSubAreaConocimientoDto;
import pucp.edu.pe.sgta.dto.SubAreaConocimientoDto;

import java.util.Collection;
import java.util.List;

public interface SubAreaConocimientoService {

	List<SubAreaConocimientoDto> getAll();

	SubAreaConocimientoDto findById(Integer id);

	SubAreaConocimientoDto create(String idCognito, SubAreaConocimientoDto dto);

	List<SubAreaConocimientoDto> listarPorUsuario(Integer usuarioId);

	void update(SubAreaConocimientoDto dto);

	void delete(Integer id);

	List<SubAreaConocimientoDto> getAllByArea(Integer idArea);

	List<InfoSubAreaConocimientoDto> listarInfoPorNombre(String nombre);

	List<SubAreaConocimientoDto> listarPorCarreraDeUsuario(String usuarioId);

	List<InfoSubAreaConocimientoDto> listarPorCarrerasUsuarioParaPerfil(Integer idUsuario);

	List<SubAreaConocimientoDto> findAllByIds(Collection<Integer> ids);
}
