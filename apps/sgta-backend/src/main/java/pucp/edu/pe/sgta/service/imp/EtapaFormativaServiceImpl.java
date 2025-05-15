package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.EtapaFormativaDto;
import pucp.edu.pe.sgta.dto.EtapaFormativaNombreDTO;
import pucp.edu.pe.sgta.mapper.EtapaFormativaMapper;
import pucp.edu.pe.sgta.model.EtapaFormativa;
import pucp.edu.pe.sgta.repository.EtapaFormativaRepository;
import pucp.edu.pe.sgta.service.inter.EtapaFormativaService;

import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

import java.util.List;

@Service
public class EtapaFormativaServiceImpl implements EtapaFormativaService {

    private final EtapaFormativaRepository etapaFormativaRepository;

    public EtapaFormativaServiceImpl(EtapaFormativaRepository etapaFormativaRepository) {
        this.etapaFormativaRepository = etapaFormativaRepository;
    }

    @Override
    public List<EtapaFormativaDto> getAll() {
        return List.of();
    }

    @Override
    public EtapaFormativaDto findById(Integer id) {
        EtapaFormativa etapaFormativa = etapaFormativaRepository.findById(id).orElse(null);
        if (etapaFormativa != null) {
            return EtapaFormativaMapper.toDto(etapaFormativa);
        }
        return null;
    }

    @Override
    public void create(EtapaFormativaDto dto) {

    }

    @Override
    public void update(EtapaFormativaDto dto) {

    }

    @Override
    public void delete(Integer id) {

    }

    @Override
    public List<EtapaFormativaNombreDTO> findByCoordinadorId(Integer id) {
        List<EtapaFormativaNombreDTO> etapasFormativas = etapaFormativaRepository.findByCoordinadorId(id);
        return etapasFormativas.stream()
                .map(ef -> new EtapaFormativaNombreDTO(ef.getEtapaFormativaId(), ef.getNombre()))
                .toList();
    }

    @Override
    @Transactional
    public void actualizarEtapa(EtapaFormativaDto dto) {
        EtapaFormativa etapa = etapaFormativaRepository.findById(dto.getId())
            .orElseThrow(() -> new RuntimeException("Etapa no encontrada"));
        
        // Solo estos campos se actualizan
        etapa.setNombre(dto.getNombre());
        etapa.setCreditajePorTema(dto.getCreditajePorTema());
        etapa.setActivo(dto.getActivo());
        etapa.setFechaModificacion(OffsetDateTime.now());
        
        etapaFormativaRepository.save(etapa); // La duración no se incluirá en el UPDATE
    }

}
