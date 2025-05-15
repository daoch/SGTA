package pucp.edu.pe.sgta.service.inter;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.repository.CarreraRepository;
import pucp.edu.pe.sgta.dto.CarreraDto;
import pucp.edu.pe.sgta.model.Carrera;

@Service
public class CarreraService {
    private final CarreraRepository repo;

    public CarreraService(CarreraRepository repo) {
        this.repo = repo;
    }

    public List<CarreraDto> listarCarrerasPorUsuario(Integer usuarioId) {
        return repo.findByUsuarioId(usuarioId).stream()
            // explícitamente indicamos que 'c' es una Carrera
            .map((Carrera c) -> CarreraDto.builder()
                .id(c.getId())
                .codigo(c.getCodigo())
                .nombre(c.getNombre())
                .descripcion(c.getDescripcion())
                .build()
            )
            .collect(Collectors.toList());
    }

}
