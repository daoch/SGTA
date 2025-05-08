package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.HistorialTemaDto;
import pucp.edu.pe.sgta.mapper.HistorialTemaMapper;
import pucp.edu.pe.sgta.model.HistorialTema;
import pucp.edu.pe.sgta.repository.HistorialTemaRepository;
import pucp.edu.pe.sgta.service.inter.HistorialTemaService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class HistorialTemaServiceImpl implements HistorialTemaService {

    private final HistorialTemaRepository historialTemaRepository;

    public HistorialTemaServiceImpl(HistorialTemaRepository historialTemaRepository) {
        this.historialTemaRepository = historialTemaRepository;
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
    public void save(HistorialTemaDto historialTemaDto) {
        HistorialTema historialTema = HistorialTemaMapper.toEntity(historialTemaDto);
        historialTemaRepository.save(historialTema);
    }
}
