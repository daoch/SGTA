package pucp.edu.pe.sgta.service.imp;

import org.postgresql.util.PGInterval;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.EtapaFormativaDto;
import pucp.edu.pe.sgta.dto.EtapaFormativaNombreDTO;
import pucp.edu.pe.sgta.mapper.EtapaFormativaMapper;
import pucp.edu.pe.sgta.model.EtapaFormativa;
import pucp.edu.pe.sgta.repository.EtapaFormativaRepository;
import pucp.edu.pe.sgta.service.inter.EtapaFormativaService;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.ArrayList;
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
        Object result = etapaFormativaRepository.getEtapaFormativaByIdFunction(id);
        if (result == null)
            return null;

        Object[] row = (Object[]) result; // 👈 aquí el casteo correcto
        EtapaFormativaDto dto = new EtapaFormativaDto();

        dto.setId((Integer) row[0]);
        dto.setNombre((String) row[1]);
        dto.setCreditajePorTema((BigDecimal) row[2]);

        PGInterval pgInterval = (PGInterval) row[3];
        dto.setDuracionExposicion(convertPGIntervalToDuration(pgInterval));

        dto.setActivo((Boolean) row[4]);
        dto.setCarreraId((Integer) row[5]);

        return dto;
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
    public List<EtapaFormativaNombreDTO> findToInitializeByCoordinador(Integer coordiandorId) {
        List<EtapaFormativaNombreDTO> etapasFormativas = etapaFormativaRepository
                .findToInitializeByCoordinador(coordiandorId);
        return etapasFormativas.stream()
                .map(ef -> new EtapaFormativaNombreDTO(ef.getEtapaFormativaId(), ef.getNombre()))
                .toList();
    }

    @Override
    public List<EtapaFormativaDto> findAllActivas() {
        List<Object[]> result = etapaFormativaRepository.findAllActivas();
        List<EtapaFormativaDto> etapaFormativaDtos = new ArrayList<>();
        for (Object[] row : result) {
            EtapaFormativaDto dto = new EtapaFormativaDto();
            dto.setId((Integer) row[0]);
            dto.setNombre((String) row[1]);
            dto.setCreditajePorTema((BigDecimal) row[2]);

            PGInterval pgInterval = (PGInterval) row[3];
            dto.setDuracionExposicion(convertPGIntervalToDuration(pgInterval));

            dto.setActivo((Boolean) row[4]);
            dto.setCarreraId((Integer) row[5]);

            etapaFormativaDtos.add(dto);
        }
        return etapaFormativaDtos;
    }

    @Override
    public List<EtapaFormativaDto> findAllActivasByCoordinador(Integer coordinadorId) {
        List<Object[]> result = etapaFormativaRepository.findAllActivasByCoordinador(coordinadorId);
        List<EtapaFormativaDto> etapaFormativaDtos = new ArrayList<>();
        for (Object[] row : result) {
            EtapaFormativaDto dto = new EtapaFormativaDto();
            dto.setId((Integer) row[0]);
            dto.setNombre((String) row[1]);
            dto.setCreditajePorTema((BigDecimal) row[2]);

            PGInterval pgInterval = (PGInterval) row[3];
            dto.setDuracionExposicion(convertPGIntervalToDuration(pgInterval));

            dto.setActivo((Boolean) row[4]);
            dto.setCarreraId((Integer) row[5]);

            etapaFormativaDtos.add(dto);
        }
        return etapaFormativaDtos;
    }

    private Duration convertPGIntervalToDuration(PGInterval pgInterval) {
        long totalSeconds = 0;

        // Obtener los componentes del PGInterval
        long days = pgInterval.getDays();
        long hours = pgInterval.getHours();
        long minutes = pgInterval.getMinutes();
        long seconds = (long) pgInterval.getSeconds();

        // Convertir todo a segundos
        totalSeconds += days * 86400; // 1 día = 86400 segundos
        totalSeconds += hours * 3600; // 1 hora = 3600 segundos
        totalSeconds += minutes * 60; // 1 minuto = 60 segundos
        totalSeconds += seconds; // segundos

        return Duration.ofSeconds(totalSeconds);
    }

    // @Override
    // public List<EtapaFormativaNombreDTO> findAllActivasNombre() {
    // List<EtapaFormativaNombreDTO> etapasFormativas =
    // etapaFormativaRepository.findAllByActivoTrue();
    // return etapasFormativas.stream()
    // .map(ef -> new EtapaFormativaNombreDTO(ef.getEtapaFormativaId(),
    // ef.getNombre()))
    // .toList();
    // }
}
