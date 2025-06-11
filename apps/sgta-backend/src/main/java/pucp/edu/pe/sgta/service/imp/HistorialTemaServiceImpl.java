package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.HistorialTemaDto;
import pucp.edu.pe.sgta.mapper.HistorialTemaMapper;
import pucp.edu.pe.sgta.model.EstadoTema;
import pucp.edu.pe.sgta.model.HistorialTema;
import pucp.edu.pe.sgta.repository.EstadoTemaRepository;
import pucp.edu.pe.sgta.repository.HistorialTemaRepository;
import pucp.edu.pe.sgta.service.inter.HistorialTemaService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HistorialTemaServiceImpl implements HistorialTemaService {

    private final HistorialTemaRepository historialTemaRepository;

    private final EstadoTemaRepository estadoTemaRepository;


    public HistorialTemaServiceImpl(HistorialTemaRepository historialTemaRepository,
                                    EstadoTemaRepository estadoTemaRepository) {
        this.historialTemaRepository = historialTemaRepository;
        this.estadoTemaRepository = estadoTemaRepository;
    }

    @Override
    public HistorialTemaDto findById(Integer id) {
        Optional<HistorialTema> historialTema = historialTemaRepository.findById(id);
        if(historialTema.isPresent()) {
            HistorialTemaDto dto = HistorialTemaMapper.toDto(historialTema.get());
            return dto;
        }
        return null;
    }

    @Override
    public List<HistorialTemaDto> findByTemaId(Integer id) {
        List<HistorialTema> historialTema =  historialTemaRepository.findByTemaId(id);
        List<HistorialTemaDto> historialDto = new ArrayList<>();
        if(!historialTema.isEmpty()) {
            for (HistorialTema tema : historialTema) {
                HistorialTemaDto dto = HistorialTemaMapper.toDto(tema);
                historialDto.add(dto);
            }
        }
        return historialDto;
    }

    @Override
    public void save(HistorialTemaDto dto) {
        // 1) Mapea todos los campos excepto el estadoTema
        HistorialTema entity = HistorialTemaMapper.toEntity(dto);

        // 2) Recupera la entidad EstadoTema ya persistida
        EstadoTema estado = estadoTemaRepository
            .findByNombre(dto.getEstadoTemaNombre())
            .orElseThrow(() -> new RuntimeException(
                "EstadoTema no encontrado: " + dto.getEstadoTemaNombre()));

        // 3) Asigna la instancia gestionada
        entity.setEstadoTema(estado);

        // 4) Persiste el historial
        historialTemaRepository.save(entity);
    }

    @Override
    public List<HistorialTemaDto> listarHistorialActivoPorTema(Integer temaId) {
        List<HistorialTema> lista = historialTemaRepository.findActivoByTemaId(temaId);
        return lista.stream()
                    .map(HistorialTemaMapper::toDto)
                    .collect(Collectors.toList());
    }
}
