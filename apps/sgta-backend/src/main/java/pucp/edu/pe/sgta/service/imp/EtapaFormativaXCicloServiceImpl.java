package pucp.edu.pe.sgta.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloDto;
import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloXCarreraDto;
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

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import pucp.edu.pe.sgta.dto.UpdateEtapaFormativaRequest;
import pucp.edu.pe.sgta.dto.UsuarioDto;

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
    private EntregableRepository entregableRepository;

    @Autowired
    private ExposicionRepository exposicionRepository;

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
    public EtapaFormativaXCicloDto create(EtapaFormativaXCicloDto dto) {
        EtapaFormativaXCiclo etapaFormativaXCiclo = EtapaFormativaXCicloMapper.toEntity(dto);
        etapaFormativaXCiclo.setActivo(true);
        etapaFormativaXCiclo.setEstado("En Curso");
        EtapaFormativaXCiclo savedEtapaFormativaXCiclo = etapaFormativaXCicloRepository.save(etapaFormativaXCiclo);
        return EtapaFormativaXCicloMapper.toDto(savedEtapaFormativaXCiclo);
    }

    @Override
    public void update(EtapaFormativaXCicloDto dto) {
        
    }

    @Override
    public void delete(Integer id) {
        EtapaFormativaXCiclo etapaFormativaXCiclo = etapaFormativaXCicloRepository.findById(id).orElse(null);
        if (etapaFormativaXCiclo != null) {
            etapaFormativaXCiclo.setActivo(false);
            etapaFormativaXCicloRepository.save(etapaFormativaXCiclo);
        }
    }

    //get all by carrera id, agregar que sea activo true
    @Override
    public List<EtapaFormativaXCicloDto> getAllByCarreraId(Integer carreraId) {
        List<EtapaFormativaXCiclo> etapaFormativaXCiclos = etapaFormativaXCicloRepository.findAllByEtapaFormativa_Carrera_IdAndActivoTrue(carreraId);
        return etapaFormativaXCiclos.stream()
            .map(etapaFormativaXCiclo -> {
                EtapaFormativaXCicloDto dto = mapToDto(etapaFormativaXCiclo);
                // Obtener la información de la etapa formativa
                EtapaFormativa etapaFormativa = etapaFormativaRepository.findById(etapaFormativaXCiclo.getEtapaFormativa().getId())
                    .orElseThrow(() -> new RuntimeException("Etapa Formativa no encontrada"));
                dto.setNombreEtapaFormativa(etapaFormativa.getNombre());
                dto.setCreditajePorTema(etapaFormativa.getCreditajePorTema());
                dto.setNombreCiclo(etapaFormativaXCiclo.getCiclo().getAnio() + " - " + etapaFormativaXCiclo.getCiclo().getSemestre());
                dto.setCantidadEntregables(entregableRepository.countByEtapaFormativaXCicloIdAndActivoTrue(etapaFormativaXCiclo.getId()));
                dto.setCantidadExposiciones(exposicionRepository.countByEtapaFormativaXCicloIdAndActivoTrue(etapaFormativaXCiclo.getId()));
                
                return dto;
            })
            .collect(Collectors.toList());
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
    public EtapaFormativaXCicloDto actualizarEstadoRelacion(Integer relacionId, UpdateEtapaFormativaRequest request) {
        // Buscar la relación por ID
        EtapaFormativaXCiclo relacion = etapaFormativaXCicloRepository.findById(relacionId)
            .orElseThrow(() -> new RuntimeException("Relación no encontrada")); // <-- Usar RuntimeException

        relacion.setEstado(request.getEstado());
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

}
