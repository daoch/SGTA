package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.EventoDto;

import java.util.List;

public interface EventoService {

	List<EventoDto> listarEventosXUsuario(Integer usuarioId);

}
