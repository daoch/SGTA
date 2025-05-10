package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.AreaConocimientoDto;
import pucp.edu.pe.sgta.dto.InfoAreaConocimientoDto;
import pucp.edu.pe.sgta.dto.InfoSubAreaConocimientoDto;

import java.util.List;

public interface AreaConocimientoService {

	AreaConocimientoDto create(AreaConocimientoDto dto);

	void update(AreaConocimientoDto dto);

	void delete(Integer id);

	List<AreaConocimientoDto> getAll();

	List<AreaConocimientoDto> getAllByCarrera(Integer idCarrera);
    AreaConocimientoDto findById(Integer id);

    List<AreaConocimientoDto> listarPorUsuario(Integer usuarioId);

<<<<<<< HEAD
    List<InfoAreaConocimientoDto> listarInfoPorNombre(String nombre);

	List<InfoAreaConocimientoDto> listarPorCarrerasUsuarioParaPerfil(Integer idUsuario);
=======



>>>>>>> 1f49a275c3ebf30ea35c9243d5ca3edc8b0601c5
}
