package pucp.edu.pe.sgta.service.imp;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.CarreraDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.mapper.CarreraMapper;
import pucp.edu.pe.sgta.model.Carrera;
import pucp.edu.pe.sgta.model.UnidadAcademica;
import pucp.edu.pe.sgta.repository.CarreraRepository;
import pucp.edu.pe.sgta.repository.UnidadAcademicaRepository;
import pucp.edu.pe.sgta.service.inter.CarreraService;
import pucp.edu.pe.sgta.service.inter.UsuarioService;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CarreraServiceImpl implements CarreraService {
    private final CarreraRepository carreraRepository;
    private final UnidadAcademicaRepository unidadAcademicaRepository;
    private final UsuarioService usuarioService;

    public CarreraServiceImpl(CarreraRepository carreraRepository, 
                             UnidadAcademicaRepository unidadAcademicaRepository,
                             UsuarioService usuarioService) {
        this.carreraRepository = carreraRepository;
        this.unidadAcademicaRepository = unidadAcademicaRepository;
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
        System.out.println("antes del for1");
        List<Object[]> resultados = carreraRepository.listarCarrerasPorIdUsusario(usuarioId);


        System.out.println("antes del for");
        for (Object[] fila : resultados) {
            // DEBUG: Imprimir tipos de datos reales para evitar errores de casteo
        System.out.println("fila[0] = " + fila[0] + " (" + fila[0].getClass() + ")");
        System.out.println("fila[1] = " + fila[1] + " (" + fila[1].getClass() + ")");
        System.out.println("fila[2] = " + fila[2] + " (" + fila[2].getClass() + ")");
        System.out.println("fila[3] = " + fila[3] + " (" + fila[3].getClass() + ")");

            CarreraDto dto = new CarreraDto();
            dto.setId((Integer) fila[0]); // carrera_id
            dto.setUnidadAcademicaId((Integer) fila[1]); // unidad_academica_id
            dto.setCodigo((String) fila[2]); // codigo
            dto.setNombre((String) fila[3]); // nombre
            dto.setDescripcion((String) fila[4]); // descripcion
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

    @Override
    public CarreraDto getCarreraCoordinador(String idCognito) {
        UsuarioDto usuDto = usuarioService.findByCognitoId(idCognito);
        Integer usuarioId = usuDto.getId();
        
        List<Object[]> results = carreraRepository.obtenerCarreraCoordinador(usuarioId);
        System.out.println("results: " + results);
        if (results != null && !results.isEmpty()) {
            Object[] result = results.get(0);
            return CarreraDto.builder()
                .id(((Number) result[0]).intValue())
                .nombre((String) result[1])
                .activo(true)
                .build();
        }
        return null;
    }

    @Override
    public CarreraDto getCarreraCoordinadaPorUsuario(Integer usuarioId) {
        Optional<Carrera> carreraOpt = carreraRepository.findCarreraCoordinadaPorUsuario(usuarioId);
        if (carreraOpt.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "El usuario no coordina ninguna carrera o no está asociado a ninguna."
            );
        }

        Carrera carrera = carreraOpt.get();
        return CarreraMapper.toDto(carrera);
    }

    @Override
    public CarreraDto createCarrera(CarreraDto carreraDto) {
        Carrera carrera = CarreraMapper.toEntity(carreraDto);
        carreraRepository.save(carrera);
        return CarreraMapper.toDto(carrera);
    }

    @Override
    public CarreraDto updateCarrera(CarreraDto carreraDto) {
        // Buscar la carrera existente
        Carrera carrera = carreraRepository.findById(carreraDto.getId())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, 
                    "Carrera no encontrada con ID: " + carreraDto.getId()
                ));

        // Actualizar los campos básicos
        carrera.setCodigo(carreraDto.getCodigo());
        carrera.setNombre(carreraDto.getNombre());
        carrera.setDescripcion(carreraDto.getDescripcion());
        carrera.setActivo(carreraDto.getActivo());

        // Actualizar la unidad académica si se proporciona
        if (carreraDto.getUnidadAcademicaId() != null) {
            UnidadAcademica unidadAcademica = unidadAcademicaRepository.findById(carreraDto.getUnidadAcademicaId())
                    .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, 
                        "Unidad Académica no encontrada con ID: " + carreraDto.getUnidadAcademicaId()
                    ));
            carrera.setUnidadAcademica(unidadAcademica);
        }

        // Guardar los cambios
        Carrera updatedCarrera = carreraRepository.save(carrera);
        return CarreraMapper.toDto(updatedCarrera);
    }

    @Override
    public void deleteCarrera(Integer id) {
        // Buscar la carrera existente
        Carrera carrera = carreraRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, 
                    "Carrera no encontrada con ID: " + id
                ));

        // Soft delete - marcar como inactiva en lugar de eliminar físicamente
        carrera.setActivo(false);
        carreraRepository.save(carrera);
    }

}