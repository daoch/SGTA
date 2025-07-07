package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.CicloConEtapasDTO;
import pucp.edu.pe.sgta.dto.CicloConEtapasProjection;
import pucp.edu.pe.sgta.dto.CicloDto;
import pucp.edu.pe.sgta.mapper.CicloMapper;
import pucp.edu.pe.sgta.model.Ciclo;
import pucp.edu.pe.sgta.repository.CicloRepository;
import pucp.edu.pe.sgta.service.inter.CicloService;
import org.springframework.context.ApplicationEventPublisher;
import pucp.edu.pe.sgta.event.AuditoriaEvent;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class CicloServiceImpl implements CicloService {

    private final CicloRepository cicloRepository;
    private final ApplicationEventPublisher eventPublisher;
    

    public CicloServiceImpl(CicloRepository cicloRepository, ApplicationEventPublisher eventPublisher) {
        this.cicloRepository = cicloRepository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public List<CicloDto> getAll() {
        return List.of();
    }

    @Override
    public CicloDto findById(Integer id) {
        Ciclo ciclo = cicloRepository.findById(id).orElse(null);
        if (ciclo != null) {
            return CicloMapper.toDto(ciclo);
        }
        return null;
    }

    @Override
    public void create(String usuarioCognito,CicloDto cicloDto) {
        cicloDto.setId(null);
        cicloDto.setActivo(true);
        Ciclo ciclo = CicloMapper.toEntity(cicloDto);
        cicloRepository.save(ciclo);

        eventPublisher.publishEvent(
                new AuditoriaEvent(
                        this,
                        usuarioCognito,
                        OffsetDateTime.now(),
                        "Se crea un nuevo ciclo " + ciclo.getSemestre() + " con ID: " + ciclo.getId()
                )
        );

    }

    @Override
    public void update(String usuarioCognito,CicloDto ciclodto) {
        if (ciclodto == null || ciclodto.getId() == null) {
            throw new IllegalArgumentException("El CicloDto o su id no pueden ser nulos.");
        }

        Ciclo ciclo = cicloRepository.findById(ciclodto.getId()).orElse(null);
        if (ciclo == null) {
            throw new IllegalArgumentException("No se encontró un ciclo con el id proporcionado: " + ciclodto.getId());
        }

        if (ciclodto.getSemestre() != null)
            ciclo.setSemestre(ciclodto.getSemestre());
        if (ciclodto.getAnio() != null)
            ciclo.setAnio(ciclodto.getAnio());
        if (ciclodto.getFechaInicio() != null)
            ciclo.setFechaInicio(ciclodto.getFechaInicio());
        if (ciclodto.getFechaFin() != null)
            ciclo.setFechaFin(ciclodto.getFechaFin());
        if (ciclodto.getActivo() != null)
            ciclo.setActivo(ciclodto.getActivo());
        ciclo.setFechaModificacion(OffsetDateTime.now());

        try {
            cicloRepository.save(ciclo);
            
            // Una vez actualizado el ciclo, se puede publicar un evento de auditoría
            eventPublisher.publishEvent(
                    new AuditoriaEvent(
                            this,
                            usuarioCognito,
                            OffsetDateTime.now(),
                            "Se actualiza el ciclo con ID: " + ciclo.getId()
                    )
            );
        } catch (Exception e) {
            throw new RuntimeException("Error al actualizar el ciclo: " + e.getMessage(), e);
        }
    }

    @Override
    public void delete(Integer id) {

    }

    @Override
    public List<Ciclo> listarCiclosOrdenados() {
        return cicloRepository.findAllOrderByActivoAndFechaInicioDesc();
    }

    @Override
    public List<CicloConEtapasDTO> listarCiclosYetapasFormativas() {
        List<CicloConEtapasProjection> proyecciones = cicloRepository.findAllCiclesAndEtapaFormativas();
        return proyecciones.stream().map(p -> {
            CicloConEtapasDTO dto = new CicloConEtapasDTO();
            dto.setId(p.getCiclo_id());
            dto.setSemestre(p.getSemestre());
            dto.setAnio(p.getAnio());
            dto.setFechaInicio(p.getFecha_inicio());
            dto.setFechaFin(p.getFecha_fin());
            dto.setActivo(p.getActivo());
            dto.setFechaCreacion(
                    p.getFecha_creacion() != null ? OffsetDateTime.ofInstant(p.getFecha_creacion(), ZoneOffset.UTC)
                            : null);
            dto.setFechaModificacion(p.getFecha_modificacion() != null
                    ? OffsetDateTime.ofInstant(p.getFecha_modificacion(), ZoneOffset.UTC)
                    : null);
            dto.setEtapasFormativas(p.getEtapas_formativas());
            dto.setCantidadEtapas(p.getCantidad_etapas());
            return dto;
        }).toList();
    }

    @Override
    public List<CicloDto> listarTodosLosCiclos() {
        List<Ciclo> ciclos = cicloRepository.findAllCiclosCompletos();
        return ciclos.stream()
                .map(CicloMapper::toDto)
                .toList();
    }
}
