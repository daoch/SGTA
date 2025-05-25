package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.asesores.InfoProyectoDto;

import java.util.List;

public interface ProyectoService {

	List<InfoProyectoDto> listarProyectosUsuarioInvolucrado(int idUsuario);

}
