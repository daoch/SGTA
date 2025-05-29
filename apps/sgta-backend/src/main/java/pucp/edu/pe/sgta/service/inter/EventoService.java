package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.EventoDto;
import pucp.edu.pe.sgta.dto.asesores.InfoAreaConocimientoDto;

import java.util.List;

public interface EventoService {

	List<EventoDto> listarEventosXUsuario(Integer usuarioId);

}
