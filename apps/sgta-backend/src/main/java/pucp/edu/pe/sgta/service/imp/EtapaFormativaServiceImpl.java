package pucp.edu.pe.sgta.service.imp;

import org.postgresql.util.PGInterval;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.EtapaFormativaDto;
import pucp.edu.pe.sgta.dto.EtapaFormativaNombreDTO;
import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloDto;
import pucp.edu.pe.sgta.mapper.EtapaFormativaMapper;
import pucp.edu.pe.sgta.model.EtapaFormativa;
import pucp.edu.pe.sgta.model.EtapaFormativaXCiclo;
import pucp.edu.pe.sgta.util.EstadoEtapa;
import pucp.edu.pe.sgta.repository.CarreraRepository;
import pucp.edu.pe.sgta.repository.CicloRepository;
import pucp.edu.pe.sgta.repository.EtapaFormativaRepository;
import pucp.edu.pe.sgta.repository.EtapaFormativaXCicloRepository;
import pucp.edu.pe.sgta.service.inter.EtapaFormativaService;

import pucp.edu.pe.sgta.model.Carrera;


import java.math.BigDecimal;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;


@Service
public class EtapaFormativaServiceImpl implements EtapaFormativaService {

    @Autowired
    private EtapaFormativaXCicloRepository etapaXCicloRepository;

    @Autowired
    private CicloRepository cicloRepository;

    @Autowired
    private CarreraRepository carreraRepository;

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
        if (result == null) return null;

        Object[] row = (Object[]) result;
        EtapaFormativaDto dto = new EtapaFormativaDto();

        dto.setId((Integer) row[0]);
        dto.setNombre((String) row[1]);
        dto.setCreditajePorTema((BigDecimal) row[2]);
        
        // Convertir PGInterval a Duration
        PGInterval pgInterval = (PGInterval) row[3];
        if (pgInterval != null) {
            dto.setDuracionExposicion(convertPGIntervalToDuration(pgInterval));
        }
        
        dto.setActivo((Boolean) row[4]);
        dto.setCarreraId((Integer) row[5]);

        return dto;
    }

    

    @Override
    public void update(EtapaFormativaDto dto) {

    }

    @Override
    public void delete(Integer id) {

    }

    @Override
    public List<EtapaFormativaNombreDTO> findToInitializeByCoordinador(Integer coordiandorId) {
        List<EtapaFormativaNombreDTO> etapasFormativas = etapaFormativaRepository.findToInitializeByCoordinador(coordiandorId);
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
            
            // Convertir PGInterval a Duration
            PGInterval pgInterval = (PGInterval) row[3];
            if (pgInterval != null) {
                dto.setDuracionExposicion(convertPGIntervalToDuration(pgInterval));
            }
            
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
            
            // Convertir PGInterval a Duration
            PGInterval pgInterval = (PGInterval) row[3];
            if (pgInterval != null) {
                dto.setDuracionExposicion(convertPGIntervalToDuration(pgInterval));
            }
            
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
        totalSeconds += days * 86400;  // 1 día = 86400 segundos
        totalSeconds += hours * 3600;  // 1 hora = 3600 segundos
        totalSeconds += minutes * 60;  // 1 minuto = 60 segundos
        totalSeconds += seconds;       // segundos

        return Duration.ofSeconds(totalSeconds);
    }
/* 
    @Override
    public void vincularACiclo(Integer etapaId, Integer cicloId) {
        var etapa = etapaFormativaRepository.findById(etapaId).orElseThrow();
        var ciclo = cicloRepository.findById(cicloId).orElseThrow();
        if (etapaXCicloRepository.existsByEtapaFormativaAndCiclo(etapa, ciclo)) return;
        var efc = new EtapaFormativaXCiclo();
        efc.setEtapaFormativa(etapa);
        efc.setCiclo(ciclo);
        efc.setEstado(EstadoEtapa.EN_CURSO);
        etapaXCicloRepository.save(efc);
    }

    @Override
    public void finalizar(Integer etapaXCicloId) {
        var efc = etapaXCicloRepository.findById(etapaXCicloId)
            .orElseThrow(() -> new RuntimeException("Vínculo no encontrado: " + etapaXCicloId));
        efc.setEstado(EstadoEtapa.FINALIZADO);
        etapaXCicloRepository.save(efc);
    }

    @Override
    public void reactivar(Integer etapaXCicloId) {
        var efc = etapaXCicloRepository.findById(etapaXCicloId)
            .orElseThrow(() -> new RuntimeException("Vínculo no encontrado: " + etapaXCicloId));
        efc.setEstado(EstadoEtapa.EN_CURSO);
        etapaXCicloRepository.save(efc);
    }

    @Override
    public List<EtapaFormativaXCicloDto> findHistorialByEtapaId(Integer etapaId) {
        return etapaXCicloRepository.findAllByEtapaFormativaId(etapaId)
            .stream()
            .map(efc -> EtapaFormativaXCicloDto.builder()
                .id(efc.getId())
                .etapaFormativaId(efc.getEtapaFormativa().getId())
                .cicloId(efc.getCiclo().getId())
                .activo(efc.getActivo())
                .fechaCreacion(efc.getFechaCreacion())
                .fechaModificacion(efc.getFechaModificacion())
                .build())
            .toList();
    }
*/
    @Override
    public EtapaFormativaDto create(EtapaFormativaDto dto) {
        try {
            // 1) Validar y cargar la Carrera
            var carrera = carreraRepository.findById(dto.getCarreraId())
                .orElseThrow(() -> new RuntimeException("Carrera no encontrada: " + dto.getCarreraId()));

            // 2) Guardar Duration para uso posterior
            Duration duration = dto.getDuracionExposicion();
            
            // 3) Crear entidad sin la duración (ahora es @Transient)
            var etapa = new EtapaFormativa();
            etapa.setNombre(dto.getNombre().toUpperCase());
            etapa.setCreditajePorTema(dto.getCreditajePorTema());
            etapa.setCarrera(carrera);
            
            // 4) Guardar para obtener el ID
            var saved = etapaFormativaRepository.save(etapa);
            
            // 5) Actualizar duracionExposicion por separado con SQL nativo
            if (duration != null) {
                String durationStr = formatDuration(duration);
                etapaFormativaRepository.updateDuracionExposicion(saved.getId(), durationStr);
                
                // Actualizamos el campo transitorio para el DTO de respuesta
                saved.setDuracionExposicion(duration);
            }

            // 6) Construir DTO de respuesta
            return EtapaFormativaDto.builder()
                .id(saved.getId())
                .nombre(saved.getNombre())
                .creditajePorTema(saved.getCreditajePorTema())
                .duracionExposicion(saved.getDuracionExposicion())
                .activo(saved.getActivo())
                .carreraId(carrera.getId())
                .build();
        } catch (Exception e) {
            throw new RuntimeException("Error al crear etapa formativa: " + e.getMessage(), e);
        }
    }
    
    /**
     * Formatea un objeto Duration a un formato compatible con PostgreSQL Interval
     */
    private String formatDuration(Duration duration) {
        if (duration == null) {
            return null;
        }
        
        long seconds = duration.getSeconds();
        
        long hours = seconds / 3600;
        seconds %= 3600;
        long minutes = seconds / 60;
        seconds %= 60;
        
        // Formato compatible con PostgreSQL interval: HH:MM:SS
        return String.format("%d:%02d:%02d", hours, minutes, seconds);
    }



}
