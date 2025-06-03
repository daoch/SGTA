package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.CarreraDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.mapper.CarreraMapper;
import pucp.edu.pe.sgta.model.Carrera;
import pucp.edu.pe.sgta.repository.CarreraRepository;
import pucp.edu.pe.sgta.service.inter.CarreraService;
import pucp.edu.pe.sgta.service.inter.UsuarioService;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarreraServiceImpl implements CarreraService {
    private final CarreraRepository carreraRepository;
    private final UsuarioService usuarioService;

    public CarreraServiceImpl(CarreraRepository carreraRepository, UsuarioService usuarioService) {
        this.carreraRepository = carreraRepository;
        this.usuarioService = usuarioService;
    }
    

    @Override
    public CarreraDto findById(Integer id) {
        Carrera carrera = carreraRepository.findById(id).orElse(null);
        if (carrera != null) {
            return CarreraMapper.toDto(carrera);
        }
        return null;
    }

    @Override
    public List<CarreraDto> getAll() {
        List<Carrera> carreras = carreraRepository.findAll();
        return carreras.stream()
                .map(CarreraMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CarreraDto> getAllActive() {
        List<Carrera> carreras = carreraRepository.findAll();
        return carreras.stream()
                .filter(carrera -> carrera.getActivo())
                .map(CarreraMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CarreraDto> getCarrerasByUsuario(Integer usuarioId) {
        List<CarreraDto> carrerasList = new ArrayList<>();
        List<Object[]> resultados = carreraRepository.listarCarrerasPorIdUsusario(usuarioId);

        for (Object[] fila : resultados) {
            CarreraDto dto = new CarreraDto();
            dto.setId((Integer) fila[0]); // carrera_id
            dto.setCodigo((String) fila[1]); // codigo
            dto.setNombre((String) fila[2]); // nombre
            dto.setDescripcion((String) fila[3]); // descripcion
            dto.setActivo(true);
            carrerasList.add(dto);
        }

        return carrerasList;
    }

    @Override
    public List<CarreraDto> listarCarrerasPorUsuario(String usuario) {
        UsuarioDto usuDto = usuarioService.findByCognitoId(usuario);
		Integer usuarioId = usuDto.getId();
        return carreraRepository.findByUsuarioId(usuarioId).stream()
                // explícitamente indicamos que 'c' es una Carrera
                .map((Carrera c) -> CarreraDto.builder()
                        .id(c.getId())
                        .codigo(c.getCodigo())
                        .nombre(c.getNombre())
                        .descripcion(c.getDescripcion())
                        .build())
                .collect(Collectors.toList());

    }

}