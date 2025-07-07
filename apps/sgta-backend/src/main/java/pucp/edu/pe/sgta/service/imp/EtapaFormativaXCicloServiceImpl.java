package pucp.edu.pe.sgta.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloDto;
import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloXCarreraDto;
import pucp.edu.pe.sgta.dto.PageResponseDto;
import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloPageRequestDto;
import pucp.edu.pe.sgta.mapper.EtapaFormativaXCicloMapper;
import pucp.edu.pe.sgta.model.EtapaFormativaXCiclo;
import pucp.edu.pe.sgta.model.EtapaFormativa;
import pucp.edu.pe.sgta.repository.EtapaFormativaXCicloRepository;
import pucp.edu.pe.sgta.repository.EtapaFormativaRepository;
import pucp.edu.pe.sgta.repository.EntregableRepository;
import pucp.edu.pe.sgta.repository.ExposicionRepository;
import pucp.edu.pe.sgta.service.inter.EtapaFormativaXCicloService;
import pucp.edu.pe.sgta.service.inter.UsuarioService;
import pucp.edu.pe.sgta.model.Carrera;
import pucp.edu.pe.sgta.repository.CarreraRepository;
import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloTesistaDto;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import pucp.edu.pe.sgta.dto.UpdateEtapaFormativaRequest;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import org.springframework.context.ApplicationEventPublisher;
import pucp.edu.pe.sgta.event.AuditoriaEvent;
import java.time.OffsetDateTime;

@Service
public class EtapaFormativaXCicloServiceImpl implements EtapaFormativaXCicloService {

    @Autowired
    private EtapaFormativaXCicloRepository etapaFormativaXCicloRepository;
    
    @Autowired
    private EtapaFormativaRepository etapaFormativaRepository;

    @Autowired
    private CarreraRepository carreraRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private EntregableRepository entregableRepository;

    @Autowired
    private ExposicionRepository exposicionRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Override
    public List<EtapaFormativaXCicloDto> getAll() {
        return List.of();
    }

    @Override
    public EtapaFormativaXCicloDto findById(Integer id) {
        EtapaFormativaXCiclo etapaFormativaXCiclo = etapaFormativaXCicloRepository.findById(id).orElse(null);
        if (etapaFormativaXCiclo != null) {
            return EtapaFormativaXCicloMapper.toDto(etapaFormativaXCiclo);
        }
        return null;
    }

    @Override
    public EtapaFormativaXCicloDto create(String usuarioCognito, EtapaFormativaXCicloDto dto) {
        // Validar si ya existe una etapa formativa con el mismo etapaFormativaId y cicloId activa
        if (etapaFormativaXCicloRepository.existsByEtapaFormativa_IdAndCiclo_IdAndActivoTrue(
                dto.getEtapaFormativaId(), dto.getCicloId())) {
            throw new RuntimeException("Ya existe una etapa formativa activa para esta etapa y ciclo. " +
                    "No se puede crear una duplicada.");
        }
        
        EtapaFormativaXCiclo etapaFormativaXCiclo = EtapaFormativaXCicloMapper.toEntity(dto);
        etapaFormativaXCiclo.setActivo(true);
        etapaFormativaXCiclo.setEstado("En Curso");
        
        EtapaFormativaXCiclo savedEtapaFormativaXCiclo = etapaFormativaXCicloRepository.save(etapaFormativaXCiclo);
        eventPublisher.publishEvent(
                new AuditoriaEvent(
                        this,
                        usuarioCognito,
                        OffsetDateTime.now(),
                        "Creó una nueva etapa formativa por ciclo con ID: " + savedEtapaFormativaXCiclo.getId()
                )
        );
        return EtapaFormativaXCicloMapper.toDto(savedEtapaFormativaXCiclo);
    }

    @Override
    public void update(EtapaFormativaXCicloDto dto) {
        
    }

    @Override
    public void delete(String usuarioCognito, Integer id) {
        EtapaFormativaXCiclo etapaFormativaXCiclo = etapaFormativaXCicloRepository.findById(id).orElse(null);
        if (etapaFormativaXCiclo != null) {
            etapaFormativaXCiclo.setActivo(false);
            etapaFormativaXCicloRepository.save(etapaFormativaXCiclo);
            eventPublisher.publishEvent(
                    new AuditoriaEvent(
                            this,
                            usuarioCognito,
                            OffsetDateTime.now(),
                            "Eliminó la etapa formativa por ciclo con ID: " + id
                    )
            );
        }
    }


    //get all by carrera id, agregar que sea activo true
    @Override
    public List<EtapaFormativaXCicloDto> getAllByCarreraId(String idCognito) {

        UsuarioDto usuario = usuarioService.findByCognitoId(idCognito);

        List<Object[]> results = carreraRepository.obtenerCarreraCoordinador(usuario.getId());
        if (results != null && !results.isEmpty()) {
            Object[] result = results.get(0);
            
            Carrera carrera = new Carrera();
            carrera.setId((Integer) result[0]);
            carrera.setNombre((String) result[1]);
            Integer carreraId = carrera.getId();
            List<EtapaFormativaXCiclo> etapaFormativaXCiclos = etapaFormativaXCicloRepository.findAllByEtapaFormativa_Carrera_IdAndActivoTrue(carreraId);
            return etapaFormativaXCiclos.stream()
                .map(etapaFormativaXCiclo -> {
                    EtapaFormativaXCicloDto dto = mapToDto(etapaFormativaXCiclo);
                    // Obtener la información de la etapa formativa
                    EtapaFormativa etapaFormativa = etapaFormativaRepository.findById(etapaFormativaXCiclo.getEtapaFormativa().getId())
                        .orElseThrow(() -> new RuntimeException("Etapa Formativa no encontrada"));
                    dto.setNombreEtapaFormativa(etapaFormativa.getNombre());
                    dto.setNombreCiclo(etapaFormativaXCiclo.getCiclo().getAnio() + " - " + etapaFormativaXCiclo.getCiclo().getSemestre());
                    dto.setCreditajePorTema(etapaFormativa.getCreditajePorTema());
                    dto.setCantidadEntregables(entregableRepository.countByEtapaFormativaXCicloIdAndActivoTrue(etapaFormativaXCiclo.getId()));
                    dto.setCantidadExposiciones(exposicionRepository.countByEtapaFormativaXCicloIdAndActivoTrue(etapaFormativaXCiclo.getId()));
                    return dto;
                })
                .collect(Collectors.toList());
        } else {
            throw new RuntimeException("No se encontró la carrera para el usuario con id: " + usuario.getId());
        }

        
    }

    //get all by carrera id and ciclo id
    @Override
    public List<EtapaFormativaXCicloDto> getAllByCarreraIdAndCicloId(Integer carreraId, Integer cicloId) {
        List<EtapaFormativaXCiclo> etapaFormativaXCiclos = etapaFormativaXCicloRepository.findAllByEtapaFormativa_Carrera_IdAndCiclo_IdAndActivoTrue(carreraId, cicloId);
        if (etapaFormativaXCiclos.isEmpty()) {
            return List.of();
        }
        return etapaFormativaXCiclos.stream().map(EtapaFormativaXCicloMapper::toDto).toList();
    }

    private EtapaFormativaXCicloDto mapToDto(EtapaFormativaXCiclo etapaFormativaXCiclo) {
        return EtapaFormativaXCicloMapper.toDto(etapaFormativaXCiclo);
    }

    @Override
    public EtapaFormativaXCicloDto actualizarEstadoRelacion(String usuarioCognito, Integer relacionId, UpdateEtapaFormativaRequest request) {
        // Buscar la relación por ID
        EtapaFormativaXCiclo relacion = etapaFormativaXCicloRepository.findById(relacionId)
            .orElseThrow(() -> new RuntimeException("Relación no encontrada")); 

        relacion.setEstado(request.getEstado());

        // Publicar evento de auditoría
        eventPublisher.publishEvent(
            new AuditoriaEvent(
                this,
                usuarioCognito,
                OffsetDateTime.now(),
                "Actualizó el estado de la etapa formativa por ciclo con ID: " + relacionId
            )
        );

        EtapaFormativaXCiclo relacionActualizada = etapaFormativaXCicloRepository.save(relacion);
        return EtapaFormativaXCicloMapper.toDto(relacionActualizada);
    }

    @Override
    public List<EtapaFormativaXCicloXCarreraDto> listarEtapasFormativasXCicloXCarrera(Integer carreraId) {
        List<Object[]> result = etapaFormativaXCicloRepository.listarEtapasFormativasXCicloXCarrera(carreraId);
        List<EtapaFormativaXCicloXCarreraDto> etapas = new ArrayList<>();

        for(Object[] row: result){
            EtapaFormativaXCicloXCarreraDto etapa = new EtapaFormativaXCicloXCarreraDto();
            etapa.setId((Integer) row[0]);
            etapa.setEtapaFormativaId((Integer) row[1]);
            etapa.setEtapaFormativaNombre((String) row[2]);
            etapa.setCicloId((Integer) row[3]);
            etapa.setCicloNombre((String) row[4]);
            etapas.add(etapa);
        }
        return etapas;
    }

    @Override
    public EtapaFormativaXCicloDto getEtapaFormativaXCicloByEtapaId(Integer etapaXCicloId) {
        List<Object[]> result = etapaFormativaXCicloRepository.getEtapaFormativaXCicloByEtapaId(etapaXCicloId);
        EtapaFormativaXCicloDto etapa = new EtapaFormativaXCicloDto();
        for(Object[] row: result){
            etapa.setEtapaFormativaId((Integer) row[0]);
            etapa.setNombreEtapaFormativa((String) row[1]);
            etapa.setCreditajePorTema((BigDecimal) row[2]);
            etapa.setDuracionExposicion((String) row[3]);
            etapa.setCicloId((Integer) row[4]);
            etapa.setNombreCiclo((String) row[5]);
            etapa.setId((Integer) row[6]);
        }
        return etapa;
    }

    @Override
    public List<EtapaFormativaXCicloTesistaDto> listarEtapasFormativasXCicloTesista(String idCognito) {
        Integer usuarioId = usuarioService.findByCognitoId(idCognito).getId();

        List<Object[]> result = etapaFormativaXCicloRepository.listarEtapasFormativasXCicloTesista(usuarioId);
        List<EtapaFormativaXCicloTesistaDto> etapas = new ArrayList<>();

        for(Object[] row: result){
            EtapaFormativaXCicloTesistaDto etapa = new EtapaFormativaXCicloTesistaDto();
            etapa.setId((Integer) row[0]);//PRIMERO EL ID DEL LA ETAPAFORMATICA X CICLO
            etapa.setEtapaFormativaId((Integer) row[1]);
            etapa.setEtapaFormativaNombre((String) row[2]);
            etapa.setCicloId((Integer) row[3]);
            etapa.setCicloNombre((String) row[4]);
            etapa.setCarreraId((Integer) row[5]);
            etapa.setCarreraNombre((String) row[6]);
            etapa.setActivo((Boolean) row[7]);
            etapa.setEstado((String) row[8]);
            etapas.add(etapa);
        }
        return etapas;
    }

    @Override
    public PageResponseDto<EtapaFormativaXCicloDto> getAllByCarreraIdPaginated(String idCognito, EtapaFormativaXCicloPageRequestDto request) {
        UsuarioDto usuario = usuarioService.findByCognitoId(idCognito);

        List<Object[]> results = carreraRepository.obtenerCarreraCoordinador(usuario.getId());
        if (results != null && !results.isEmpty()) {
            Object[] result = results.get(0);
            
            Carrera carrera = new Carrera();
            carrera.setId((Integer) result[0]);
            carrera.setNombre((String) result[1]);
            Integer carreraId = carrera.getId();

            // Crear Pageable sin ordenamiento (el ordenamiento se maneja en la query nativa)
            Pageable pageable = PageRequest.of(request.getPage(), request.getSize());

            // Obtener datos paginados con filtros
            Page<EtapaFormativaXCiclo> etapaFormativaXCicloPage = etapaFormativaXCicloRepository
                .findAllByCarreraIdWithFilters(carreraId, request.getEstado(), request.getSearch(), 
                    request.getAnio(), request.getSemestre(), pageable);

            // Mapear a DTOs
            List<EtapaFormativaXCicloDto> dtos = etapaFormativaXCicloPage.getContent().stream()
                .map(etapaFormativaXCiclo -> {
                    EtapaFormativaXCicloDto dto = mapToDto(etapaFormativaXCiclo);
                    // Obtener la información de la etapa formativa
                    EtapaFormativa etapaFormativa = etapaFormativaRepository.findById(etapaFormativaXCiclo.getEtapaFormativa().getId())
                        .orElseThrow(() -> new RuntimeException("Etapa Formativa no encontrada"));
                    dto.setNombreEtapaFormativa(etapaFormativa.getNombre());
                    dto.setNombreCiclo(etapaFormativaXCiclo.getCiclo().getAnio() + " - " + etapaFormativaXCiclo.getCiclo().getSemestre());
                    dto.setCreditajePorTema(etapaFormativa.getCreditajePorTema());
                    dto.setCantidadEntregables(entregableRepository.countByEtapaFormativaXCicloIdAndActivoTrue(etapaFormativaXCiclo.getId()));
                    dto.setCantidadExposiciones(exposicionRepository.countByEtapaFormativaXCicloIdAndActivoTrue(etapaFormativaXCiclo.getId()));
                    return dto;
                })
                .collect(Collectors.toList());

            // Construir respuesta paginada
            return PageResponseDto.<EtapaFormativaXCicloDto>builder()
                .content(dtos)
                .page(etapaFormativaXCicloPage.getNumber())
                .size(etapaFormativaXCicloPage.getSize())
                .totalElements(etapaFormativaXCicloPage.getTotalElements())
                .totalPages(etapaFormativaXCicloPage.getTotalPages())
                .hasNext(etapaFormativaXCicloPage.hasNext())
                .hasPrevious(etapaFormativaXCicloPage.hasPrevious())
                .build();
        } else {
            throw new RuntimeException("No se encontró la carrera para el usuario con id: " + usuario.getId());
        }
    }

}
