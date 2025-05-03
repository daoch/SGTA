package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.TemaDto;

import java.util.List;

public interface TemaService {
    List<TemaDto> getAll();
    TemaDto findById(Integer id);
    List<TemaDto> findByUsuario(Integer idUsuario); //Works for asesor, alumno, coordinador and revisor
    void createTemaPropuesta(TemaDto dto, Integer idUsuarioCreador);
    void update(TemaDto dto);
    void delete(Integer id);
    void createInscripcionTema(TemaDto dto, Integer idUsuarioCreador); //Works for asesor, alumno, coordinador and revisor

	List<TemaDto> listarTemasPropuestosAlAsesor(Integer asesorId);

	List<TemaDto> listarTemasPropuestosPorSubAreaConocimiento(List<Integer> subareaIds);

}
