package pucp.edu.pe.sgta.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.asesores.InfoProyectoDto;
import pucp.edu.pe.sgta.repository.ProyectoRepository;
import pucp.edu.pe.sgta.service.inter.ProyectoService;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProyectoServiceImpl implements ProyectoService {

	@Autowired
	ProyectoRepository proyectoRepository;

	@Override
	public List<InfoProyectoDto> listarProyectosUsuarioInvolucrado(int idUsuario) {
		List<InfoProyectoDto> proyectos = new ArrayList<>();
		List<Object[]> query = proyectoRepository.listarProyectosUsuarioInvolucrado(idUsuario);
		for (Object[] queryResult : query) {
			InfoProyectoDto proyecto = InfoProyectoDto.fromListarProyectosUsuarioInvolucrado(queryResult);
			proyectos.add(proyecto);
		}
		return proyectos;
	}

}
