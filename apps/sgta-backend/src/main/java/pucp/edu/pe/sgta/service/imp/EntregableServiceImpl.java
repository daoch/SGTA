package pucp.edu.pe.sgta.service.imp;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.EntregableAlumnoDto;
import pucp.edu.pe.sgta.dto.EntregableDto;
import pucp.edu.pe.sgta.dto.EntregableSubidoDto;
import pucp.edu.pe.sgta.mapper.EntregableMapper;
import pucp.edu.pe.sgta.model.Entregable;
import pucp.edu.pe.sgta.model.EtapaFormativaXCiclo;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.repository.EntregableRepository;
import pucp.edu.pe.sgta.repository.UsuarioRepository;
import pucp.edu.pe.sgta.service.inter.EntregableService;
import pucp.edu.pe.sgta.util.EstadoActividad;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import pucp.edu.pe.sgta.dto.EntregableXTemaDto;

@Service
public class EntregableServiceImpl implements EntregableService {

    private final EntregableRepository entregableRepository;
    private final UsuarioRepository usuarioRepository;

    public EntregableServiceImpl(EntregableRepository entregableRepository, UsuarioRepository usuarioRepository) {
        this.entregableRepository = entregableRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<EntregableDto> listarEntregablesXEtapaFormativaXCiclo(Integer etapaFormativaXCicloId) {
        System.out.println("listarEntregablesXEtapaFormativaXCiclo");
        List<Object[]> resultados = entregableRepository.listarEntregablesXEtapaFormativaXCiclo(etapaFormativaXCicloId);
        try {
            return resultados.stream()
                    .map(resultado -> new EntregableDto(
                            ((Number) resultado[0]).intValue(), // id
                            ((Number) resultado[1]).intValue(), // id etapa formativa x ciclo
                            (String) resultado[2], // nombre
                            (String) resultado[3], // descripcion
                            ((Instant) resultado[4]).atOffset(ZoneOffset.UTC), // fecha inicio
                            ((Instant) resultado[5]).atOffset(ZoneOffset.UTC), // fecha fin
                            EstadoActividad.valueOf((String) resultado[6]), // estado
                            (boolean) resultado[7], // es evaluable
                            ((Number) resultado[8]).intValue(), // maximo_documentos
                            (String) resultado[9], // extensiones_permitidas
                            ((Number) resultado[10]).intValue() // peso_maximo_documento
                    ))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace(); // ← Te mostrará en consola exactamente qué falló
            throw new RuntimeException("Error al mapear entregables", e);
        }
    }

    public List<EntregableXTemaDto> listarEntregablesConEnvioXEtapaFormativaXCiclo(Integer etapaId, Integer temaId) {

        List<Object[]> resultados = entregableRepository.listarEntregablesConEnvioXEtapaFormativaXCiclo(etapaId,
                temaId);
        return resultados.stream()
                .map(resultado -> new EntregableXTemaDto(
                        ((Number) resultado[0]).intValue(), // id
                        ((Number) resultado[1]).intValue(), // etapa_formativa_x_ciclo_id
                        (String) resultado[2], // nombre
                        (String) resultado[3], // descripcion
                        ((Instant) resultado[4]).atOffset(ZoneOffset.UTC), // fecha_inicio
                        ((Instant) resultado[5]).atOffset(ZoneOffset.UTC), // fecha_fin
                        EstadoActividad.valueOf((String) resultado[6]), // estado
                        (boolean) resultado[7], // es_evaluable
                        ((Number) resultado[8]).intValue(), // maximo_documentos
                        (String) resultado[9], // extensiones_permitidas
                        ((Number) resultado[10]).intValue(), // peso_maximo_documento
                        resultado[11] != null ? ((Instant) resultado[11]).atOffset(ZoneOffset.UTC) : null // fecha_envio
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public Integer create(Integer etapaFormativaXCicloId, EntregableDto entregableDto) {
        entregableDto.setId(null);
        Entregable entregable = EntregableMapper.toEntity(entregableDto);
        EtapaFormativaXCiclo efc = new EtapaFormativaXCiclo();
        efc.setId(etapaFormativaXCicloId);
        entregable.setEtapaFormativaXCiclo(efc);
        entregable.setFechaCreacion(OffsetDateTime.now());
        if (entregable.getEstado() == null) {
            entregable.setEstado(EstadoActividad.no_iniciado);
        }
        entregableRepository.save(entregable);
        return entregable.getId();
    }

    @Transactional
    @Override
    public void update(EntregableDto entregableDto) {
        // Aqui se necesitan todos los atributos del DTO para actualizar el objeto
        Entregable entregableToUpdate = entregableRepository.findById(entregableDto.getId())
                .orElseThrow(() -> new RuntimeException("Entregable no encontrado con ID: " + entregableDto.getId()));

        entregableToUpdate.setNombre(entregableDto.getNombre());
        entregableToUpdate.setDescripcion(entregableDto.getDescripcion());
        entregableToUpdate.setFechaInicio(entregableDto.getFechaInicio());
        entregableToUpdate.setFechaFin(entregableDto.getFechaFin());
        entregableToUpdate.setEsEvaluable(entregableDto.isEsEvaluable());
        entregableToUpdate.setMaximoDocumentos(entregableDto.getMaximoDocumentos());
        entregableToUpdate.setExtensionesPermitidas(entregableDto.getExtensionesPermitidas());
        entregableToUpdate.setPesoMaximoDocumento(entregableDto.getPesoMaximoDocumento());
        entregableToUpdate.setFechaModificacion(OffsetDateTime.now());
        entregableRepository.save(entregableToUpdate);
    }

    @Transactional
    @Override
    public void delete(Integer id) {
        // Aqui solo se necesita el id del entregable para eliminar (lógicamente) el
        // objeto
        Entregable entregableToDelete = entregableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entregable no encontrado con ID: " + id));

        entregableToDelete.setActivo(false);
        entregableToDelete.setFechaModificacion(OffsetDateTime.now());
        entregableRepository.save(entregableToDelete);
    }

    @Override
    public List<EntregableDto> getAll() {
        List<Entregable> entregables = entregableRepository.findAll();
        return entregables.stream().map(EntregableMapper::toDto).toList();
    }

    @Override
    public EntregableDto findById(Integer id) {
        return entregableRepository.findById(id)
                .map(EntregableMapper::toDto)
                .orElse(null);
    }

    @Override
    public List<EntregableAlumnoDto> listarEntregablesPorAlumno(String alumnoId) {
        Optional<Usuario> usuario = usuarioRepository.findByIdCognito(alumnoId);
        if (usuario.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado con ID Cognito: " + alumnoId);
        }

        Usuario user = usuario.get();

        List<Object[]> result = entregableRepository.listarEntregablesPorAlumno(user.getId());
        List<EntregableAlumnoDto> entregables = new ArrayList<>();

        for (Object[] row : result) {
            EntregableAlumnoDto dto = new EntregableAlumnoDto();
            dto.setEntregableId((Integer) row[0]);
            dto.setEntregableNombre((String) row[1]);
            dto.setEntregableDescripcion((String) row[2]);
            dto.setEntregableFechaInicio(((Instant) row[3]).atOffset(ZoneOffset.UTC));
            dto.setEntregableFechaFin(((Instant) row[4]).atOffset(ZoneOffset.UTC));
            dto.setEntregableEstado((String) row[5]);
            dto.setEntregableEsEvaluable((Boolean) row[6]);
            dto.setEntregableMaximoDocumentos((Integer) row[7]);
            dto.setEntregableExtensionesPermitidas((String) row[8]);
            dto.setEntregablePesoMaximoDocumento((Integer) row[9]);
            dto.setEtapaFormativaId((Integer) row[10]);
            dto.setEtapaFormativaNombre((String) row[11]);
            dto.setCicloId((Integer) row[12]);
            dto.setCicloNombre((String) row[13]);
            dto.setCicloAnio((Integer) row[14]);
            dto.setCicloSemestre((String) row[15]);
            dto.setTemaId((Integer) row[16]);
            if (row[17] != null) {
                dto.setEntregableFechaEnvio(((Instant) row[17]).atOffset(ZoneOffset.UTC));
            } else {
                dto.setEntregableFechaEnvio(null);
            }
            dto.setEntregableComentario((String) row[18]);
            dto.setEntregableXTemaId((Integer) row[19]);
            entregables.add(dto);
        }

        return entregables;
    }

    @Transactional
    @Override
    public void entregarEntregable(Integer entregableXTemaId, EntregableSubidoDto entregableDto) {
        entregableRepository.entregarEntregable(entregableXTemaId,
                entregableDto.getComentario(),
                entregableDto.getEstado());
    }
}
