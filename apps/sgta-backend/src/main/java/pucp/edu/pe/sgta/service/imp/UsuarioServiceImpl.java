package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.InfoAreaConocimiento;
import pucp.edu.pe.sgta.dto.InfoSubAreaConocimientoDto;
import pucp.edu.pe.sgta.dto.PerfilAsesorDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.mapper.InfoAreaConocimientoMapper;
import pucp.edu.pe.sgta.mapper.InfoSubAreaConocimientoMapper;
import pucp.edu.pe.sgta.mapper.PerfilAsesorMapper;
import pucp.edu.pe.sgta.mapper.UsuarioMapper;
import pucp.edu.pe.sgta.model.AreaConocimiento;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.model.UsuarioXSubAreaConocimiento;
import pucp.edu.pe.sgta.repository.AreaConocimientoRespository;
import pucp.edu.pe.sgta.repository.SubAreaConocimientoRepository;
import pucp.edu.pe.sgta.repository.UsuarioRepository;
import pucp.edu.pe.sgta.repository.UsuarioXSubAreaConocimientoRepository;
import pucp.edu.pe.sgta.service.inter.UsuarioService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImpl implements UsuarioService {

	private final UsuarioRepository usuarioRepository;
	private final UsuarioXSubAreaConocimientoRepository usuarioXSubAreaConocimientoRepository;
	private final SubAreaConocimientoRepository subAreaConocimientoRepository;
	private final AreaConocimientoRespository areaConocimientoRepository;

	public UsuarioServiceImpl(UsuarioRepository usuarioRepository
							,UsuarioXSubAreaConocimientoRepository usuarioXSubAreaConocimientoRepository
							,SubAreaConocimientoRepository subAreaConocimientoRepository
							,AreaConocimientoRespository areaConocimientoRepository) {
		this.usuarioRepository = usuarioRepository;
		this.usuarioXSubAreaConocimientoRepository = usuarioXSubAreaConocimientoRepository;
		this.subAreaConocimientoRepository = subAreaConocimientoRepository;
		this.areaConocimientoRepository = areaConocimientoRepository;
	}

	@Override
	public void createUsuario(UsuarioDto usuarioDto) {
		usuarioDto.setId(null);

		Usuario usuario = UsuarioMapper.toEntity(usuarioDto);

		usuarioRepository.save(usuario);
	}

	@Override
	public UsuarioDto findUsuarioById(Integer id) {
		Usuario usuario = usuarioRepository.findById(id).orElse(null);
		if (usuario != null) {
			return UsuarioMapper.toDto(usuario);
		}
		return null;
	}

	@Override
	public List<UsuarioDto> findAllUsuarios() {
		return List.of();
	}

	@Override
	public void updateUsuario(UsuarioDto usuarioDto) {

	}

	@Override
	public void deleteUsuario(Integer id) {

	}

	@Override
	public PerfilAsesorDto getPerfilAsesor(Integer id){
		//Primero los datos básicos de la entidad
		PerfilAsesorDto tmp;
		Usuario usuario = usuarioRepository.findById(id).orElse(null);
		if (usuario == null) {
			throw new RuntimeException("Usuario no encontrado con ID: " + id);
		}
		tmp = PerfilAsesorMapper.toDto(usuario);
		//Luego la consulta de las areas de conocimiento
		List<InfoSubAreaConocimientoDto> subareas;
		List<InfoAreaConocimiento> areas;
		List<Integer> idSubareas = usuarioXSubAreaConocimientoRepository.findAllByUsuario_IdAndActivo(id).
									stream()
									.map(UsuarioXSubAreaConocimiento::getId)
									.toList();
		subareas = subAreaConocimientoRepository.findAllByIdIn(idSubareas)
				.stream()
				.map(InfoSubAreaConocimientoMapper::toDto)
				.toList();
		//TODO: Si se llega a cambiar la relacion UsuarioXAreaConocimiento entonces cambiar aqui
		List<Integer> idAreas = subareas
				.stream()
				.map(InfoSubAreaConocimientoDto::getIdPadre)
				.distinct()
				.toList();
		areas = areaConocimientoRepository.findAllByIdIn(idAreas).
				stream()
				.map(InfoAreaConocimientoMapper::toDto)
				.toList();
		tmp.setAreaConocimientos(areas);
		tmp.setSubAreaConocimientos(subareas);
		return null;
	}
}
