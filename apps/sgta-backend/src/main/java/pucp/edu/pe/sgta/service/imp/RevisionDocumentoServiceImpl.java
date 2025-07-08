package pucp.edu.pe.sgta.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pucp.edu.pe.sgta.dto.RevisionDocumentoAsesorDto;
import pucp.edu.pe.sgta.dto.RevisionDocumentoRevisorDto;
import pucp.edu.pe.sgta.dto.RevisionDto;
import pucp.edu.pe.sgta.dto.RevisoresTemaDTO;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.dto.UsuarioTemaDto;
import pucp.edu.pe.sgta.model.RevisionDocumento;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.repository.RevisionDocumentoRepository;
import pucp.edu.pe.sgta.repository.UsuarioRepository;
import pucp.edu.pe.sgta.service.inter.RevisionDocumentoService;
import pucp.edu.pe.sgta.util.EstadoRevision;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class RevisionDocumentoServiceImpl implements RevisionDocumentoService {
    @Override
    public RevisionDocumento findById(Integer id) {
        Optional<RevisionDocumento> revision = revisionDocumentoRepository.findById(id);
        return revision.orElse(null);
    }

    @Autowired
    private RevisionDocumentoRepository revisionDocumentoRepository;
    private final UsuarioRepository usuarioRepository;
    private static final Logger logger = Logger.getLogger(RevisionDocumentoService.class.getName());

    public RevisionDocumentoServiceImpl(RevisionDocumentoRepository revisionDocumentoRepository,
            UsuarioRepository usuarioRepository) {
        this.revisionDocumentoRepository = revisionDocumentoRepository;
        this.usuarioRepository = usuarioRepository;
    }


    @Override
    public List<RevisionDocumento> findByUsuarioId(Integer usuarioId) {
        return revisionDocumentoRepository.findByUsuarioId(usuarioId);
    }

    @Override
    public List<RevisionDocumento> findByVersionDocumentoId(Integer versionDocumentoId) {
        return revisionDocumentoRepository.findByVersionDocumentoId(versionDocumentoId);
    }

    @Override
    public List<RevisionDocumento> findByEstadoRevision(EstadoRevision estadoRevision) {
        return revisionDocumentoRepository.findByEstadoRevision(estadoRevision);
    }

    @Override
    public List<RevisionDocumento> findByVersionDocumentoDocumentoId(Integer documentoId) {
        return revisionDocumentoRepository.findByVersionDocumentoDocumentoId(documentoId);
    }

    @Override
    public List<RevisionDto> findAllRevisionesCompletas() {
        List<Object[]> resultados = revisionDocumentoRepository.findAllRevisionesCompletas();
        List<RevisionDto> revisiones = new ArrayList<>();

        for (Object[] resultado : resultados) {
            RevisionDto dto = new RevisionDto();

            // ID de la revisión
            dto.setId(resultado[0] != null ? resultado[0].toString() : null);

            // Datos del estudiante
            dto.setEstudianteId(resultado[1] != null ? ((Number) resultado[1]).intValue() : null);

            // Nombre completo del estudiante
            String nombresEstudiante = resultado[2] != null ? (String) resultado[2] : "";
            String primerApellidoEstudiante = resultado[3] != null ? (String) resultado[3] : "";
            dto.setEstudiante(nombresEstudiante + " " + primerApellidoEstudiante);

            // Código del estudiante
            dto.setCodigo(resultado[5] != null ? (String) resultado[5] : null);

            // Datos del revisor (para uso interno si se necesita)
            Integer revisorId = resultado[6] != null ? ((Number) resultado[6]).intValue() : null;
            String revisorNombre = resultado[7] != null ? (String) resultado[7] : "";
            String revisorApellido = resultado[8] != null ? (String) resultado[8] : "";

            // Título y tema
            dto.setTitulo(resultado[11] != null ? (String) resultado[11] : null);

            // Fechas
            // Convertir timestamp a LocalDate para fechaEntrega (índice 16 es la
            // fecha_ultima_subida)
            if (resultado[16] != null) {
                try {
                    if (resultado[16] instanceof Timestamp) {
                        Timestamp fechaEntrega = (Timestamp) resultado[16];
                        dto.setFechaEntrega(fechaEntrega.toLocalDateTime().toLocalDate());
                    } else if (resultado[16] instanceof java.sql.Date) {
                        dto.setFechaEntrega(((java.sql.Date) resultado[16]).toLocalDate());
                    }
                } catch (Exception e) {
                    System.err.println("Error al convertir fecha de entrega: " + e.getMessage());
                }
            }

            // Fecha límite (índice 17 es fecha_limite_revision)
            if (resultado[17] != null) {
                try {
                    if (resultado[17] instanceof java.sql.Date) {
                        dto.setFechaLimite(((java.sql.Date) resultado[17]).toLocalDate());
                    } else if (resultado[17] instanceof LocalDate) {
                        dto.setFechaLimite((LocalDate) resultado[17]);
                    }
                } catch (Exception e) {
                    System.err.println("Error al convertir fecha límite: " + e.getMessage());
                }
            }

            // Estado de revisión (índice 19 es estado_revision)
            dto.setEstado(resultado[19] != null ? resultado[19].toString().toLowerCase() : null);

            // Curso (nombre de etapa formativa) (índice 23 es curso)
            dto.setCurso(resultado[23] != null ? (String) resultado[23] : null);

            // ID del curso (ID de etapa formativa) (índice 24 es etapa_formativa_id)
            dto.setCursoId(resultado[24] != null ? ((Number) resultado[24]).intValue() : null);

            // Calcular si la entrega fue a tiempo comparando fecha_envio con fecha_fin
            LocalDate fechaEnvio = null;
            LocalDate fechaFin = null;

            // Índice 21 es fecha_envio
            if (resultado[21] != null) {
                try {
                    if (resultado[21] instanceof java.sql.Date) {
                        fechaEnvio = ((java.sql.Date) resultado[21]).toLocalDate();
                    } else if (resultado[21] instanceof LocalDate) {
                        fechaEnvio = (LocalDate) resultado[21];
                    }
                } catch (Exception e) {
                    System.err.println("Error al convertir fecha de envío: " + e.getMessage());
                }
            }

            // Índice 22 es fecha_fin
            if (resultado[22] != null) {
                try {
                    if (resultado[22] instanceof Timestamp) {
                        fechaFin = ((Timestamp) resultado[22]).toLocalDateTime().toLocalDate();
                    } else if (resultado[22] instanceof java.sql.Date) {
                        fechaFin = ((java.sql.Date) resultado[22]).toLocalDate();
                    } else if (resultado[22] instanceof LocalDate) {
                        fechaFin = (LocalDate) resultado[22];
                    }
                } catch (Exception e) {
                    System.err.println("Error al convertir fecha fin: " + e.getMessage());
                }
            }

            if (fechaEnvio != null && fechaFin != null) {
                dto.setEntregaATiempo(!fechaEnvio.isAfter(fechaFin));
            } else {
                dto.setEntregaATiempo(false); // Si no hay fechas, asumimos que no está a tiempo
            }

            // Estos campos no se traen desde el backend, se dejan como null
            dto.setPorcentajePlagio(null);
            dto.setFormatoValido(null);
            dto.setCitadoCorrecto(null);

            // Número de observaciones (índice 25)
            if (resultado[25] != null) {
                dto.setObservaciones(((Number) resultado[25]).intValue());
            } else {
                dto.setObservaciones(0);
            }

            revisiones.add(dto);
        }

        return revisiones;
    }

    @Override
    public List<RevisionDto> findRevisionesByRevisorId(Integer revisorId) {
        List<Object[]> resultados = revisionDocumentoRepository.findRevisionesByRevisorId(revisorId);
        List<RevisionDto> revisiones = new ArrayList<>();

        for (Object[] resultado : resultados) {
            RevisionDto dto = new RevisionDto();

            // Mapeo de campos desde la consulta
            dto.setId(resultado[0] != null ? resultado[0].toString() : null);

            // Datos del estudiante (viene directamente de la consulta)
            dto.setEstudianteId(resultado[1] != null ? ((Number) resultado[1]).intValue() : null);

            // Concatenar nombres y apellidos para el estudiante
            String nombres = resultado[2] != null ? (String) resultado[2] : "";
            String primerApellido = resultado[3] != null ? (String) resultado[3] : "";
            dto.setEstudiante(nombres + " " + primerApellido);

            // Código del estudiante
            dto.setCodigo(resultado[5] != null ? (String) resultado[5] : null);

            // Título del tema
            dto.setTitulo(resultado[6] != null ? (String) resultado[6] : null);

            // Fecha de entrega (timestamp a LocalDate)
            if (resultado[11] != null) {
                try {
                    if (resultado[11] instanceof Timestamp) {
                        Timestamp fechaEntrega = (Timestamp) resultado[11];
                        dto.setFechaEntrega(fechaEntrega.toLocalDateTime().toLocalDate());
                    } else if (resultado[11] instanceof java.sql.Date) {
                        dto.setFechaEntrega(((java.sql.Date) resultado[11]).toLocalDate());
                    }
                } catch (Exception e) {
                    System.err.println("Error al convertir fecha de entrega: " + e.getMessage());
                }
            }

            // Fecha límite
            if (resultado[12] != null) {
                try {
                    if (resultado[12] instanceof java.sql.Date) {
                        dto.setFechaLimite(((java.sql.Date) resultado[12]).toLocalDate());
                    } else if (resultado[12] instanceof LocalDate) {
                        dto.setFechaLimite((LocalDate) resultado[12]);
                    }
                } catch (Exception e) {
                    System.err.println("Error al convertir fecha límite: " + e.getMessage());
                }
            }

            // Estado de revisión
            dto.setEstado(resultado[14] != null ? resultado[14].toString().toLowerCase() : null);

            // Curso (nombre de etapa formativa)
            dto.setCurso(resultado[18] != null ? (String) resultado[18] : null);

            // ID del curso (etapa formativa)
            dto.setCursoId(resultado[19] != null ? ((Number) resultado[19]).intValue() : null);

            // Calcular si la entrega fue a tiempo comparando fecha_envio con fecha_fin
            LocalDate fechaEnvio = null;
            LocalDate fechaFin = null;

            if (resultado[16] != null) {
                try {
                    if (resultado[16] instanceof java.sql.Date) {
                        fechaEnvio = ((java.sql.Date) resultado[16]).toLocalDate();
                    } else if (resultado[16] instanceof LocalDate) {
                        fechaEnvio = (LocalDate) resultado[16];
                    }
                } catch (Exception e) {
                    System.err.println("Error al convertir fecha de envío: " + e.getMessage());
                }
            }

            if (resultado[17] != null) {
                try {
                    if (resultado[17] instanceof Timestamp) {
                        fechaFin = ((Timestamp) resultado[17]).toLocalDateTime().toLocalDate();
                    } else if (resultado[17] instanceof java.sql.Date) {
                        fechaFin = ((java.sql.Date) resultado[17]).toLocalDate();
                    } else if (resultado[17] instanceof LocalDate) {
                        fechaFin = (LocalDate) resultado[17];
                    }
                } catch (Exception e) {
                    System.err.println("Error al convertir fecha fin: " + e.getMessage());
                }
            }

            if (fechaEnvio != null && fechaFin != null) {
                dto.setEntregaATiempo(!fechaEnvio.isAfter(fechaFin));
            } else {
                dto.setEntregaATiempo(false);
            }

            // Estos campos no se traen desde el backend, se dejan como null
            dto.setPorcentajePlagio(null);
            dto.setFormatoValido(null);
            dto.setCitadoCorrecto(null);

            // Número de observaciones
            if (resultado[20] != null) {
                dto.setObservaciones(((Number) resultado[20]).intValue());
            } else {
                dto.setObservaciones(0);
            }

            revisiones.add(dto);
        }

        return revisiones;
    }

    @Override
    public List<RevisionDocumentoAsesorDto> listarRevisionDocumentosPorAsesor(String asesorId) {
        Optional<Usuario> usuario = usuarioRepository.findByIdCognito(asesorId);
        if (usuario.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado con ID Cognito: " + asesorId);
        }

        Usuario user = usuario.get();

        List<Object[]> result = revisionDocumentoRepository.listarRevisionDocumentosPorAsesor(user.getId());
        List<RevisionDocumentoAsesorDto> documentos = new ArrayList<>();

        for (Object[] row : result) {
            RevisionDocumentoAsesorDto dto = new RevisionDocumentoAsesorDto();

            dto.setId((Integer) row[0]); // revision_id
            dto.setTitulo((String) row[1]); // tema
            dto.setEntregable((String) row[2]); // entregable
            dto.setEstudiante((String) row[3]); // estudiante
            dto.setCodigo((String) row[4]); // código PUCP
            dto.setCurso((String) row[5]); // curso

            dto.setFechaEntrega(row[6] != null
                    ? ((Instant) row[6]).atOffset(ZoneOffset.UTC)
                    : null);

            dto.setEstado((String) row[7]); // estado_revision

            dto.setFechaLimiteRevision(row[9] != null
                    ? ((Instant) row[9]).atOffset(ZoneOffset.UTC)
                    : null); // fecha_limite

            dto.setPorcentajeSimilitud(row[10] != null ? ((Number) row[10]).doubleValue() : null);
            dto.setPorcentajeGenIA(row[11] != null ? ((Number) row[11]).doubleValue() : null);

            documentos.add(dto);
        }
        return documentos;
    }

    @Override
    @Transactional
    public void actualizarEstadoRevision(Integer revisionId, String nuevoEstado) {
        System.out.println(">>> Actualizando revisión con ID: " + revisionId + " al estado: " + nuevoEstado);

        // Ya no buscas ni seteas, solo llamas el update con casteo
        revisionDocumentoRepository.actualizarEstadoRevisionConCast(revisionId, nuevoEstado);
    }

    public RevisionDocumentoAsesorDto obtenerRevisionDocumentoPorId(Integer revisionId) {
        List<Object[]> result = revisionDocumentoRepository.obtenerRevisionDocumentoPorId(revisionId);

        if (result.isEmpty()) {
            throw new RuntimeException("No se encontró ninguna revisión con ID: " + revisionId);
        }

        Object[] row = result.get(0);
        RevisionDocumentoAsesorDto dto = new RevisionDocumentoAsesorDto();

        dto.setId((Integer) row[0]); // revision_id
        dto.setTitulo((String) row[1]); // tema
        dto.setEntregable((String) row[2]); // entregable
        dto.setEstudiante((String) row[3]); // estudiante
        dto.setCodigo((String) row[4]); // código PUCP
        dto.setCurso((String) row[5]); // curso

        dto.setFechaEntrega(row[6] != null
                ? ((Instant) row[6]).atOffset(ZoneOffset.UTC)
                : null);
        dto.setFechaLimiteEntrega(row[7] != null
                ? ((Instant) row[7]).atOffset(ZoneOffset.UTC)
                : null);
        dto.setFechaRevision(row[8] != null
                ? ((Instant) row[8]).atOffset(ZoneOffset.UTC)
                : null);
        dto.setFechaLimiteRevision(row[9] != null
                ? ((Instant) row[9]).atOffset(ZoneOffset.UTC)
                : null);
        dto.setEstado((String) row[10]);
        dto.setUrlDescarga((String) row[12]);
        // Valores no retornados aún por el SP
        dto.setPorcentajeGenIA(null);
        dto.setPorcentajeSimilitud(null);
        dto.setFormatoValido(null);
        dto.setCitadoCorrecto(null);
        dto.setUltimoCiclo(null);
        return dto;
    }

    @Override
    public void crearRevisiones(int entregableXTemaId) {
        revisionDocumentoRepository.crearRevisiones(entregableXTemaId);
        logger.warning("Revisiones creadas para el entregable con ID: " + entregableXTemaId);
    }

    @Override
    public void crearRevisionesJurado(int entregableXTemaId) {
        revisionDocumentoRepository.crearRevisionesJurado(entregableXTemaId);
    }

    @Override
    public void crearRevisionesRevisores(int entregableXTemaId) {
        revisionDocumentoRepository.crearRevisionesRevisores(entregableXTemaId);
        logger.warning("Revisiones creadas para los revisores en el entregable con ID: " + entregableXTemaId);
    }

    @Override
    public List<UsuarioDto> getStudentsByRevisor(Integer revisionId) {

        List<Object[]> result = revisionDocumentoRepository.getStudentsByRevisor(revisionId);
        List<UsuarioDto> usuarios = new ArrayList<>();

        for (Object[] row : result) {
            UsuarioDto dto = new UsuarioDto();
            dto.setId((Integer) row[0]);
            dto.setNombres((String) row[1]);
            dto.setPrimerApellido((String) row[2]);
            dto.setSegundoApellido((String) row[3]);
            dto.setCodigoPucp((String) row[4]);
            dto.setCorreoElectronico((String) row[5]);
            usuarios.add(dto);
        }
        return usuarios;
    }

    @Override
    public List<RevisionDocumentoRevisorDto> listarRevisionDocumentosPorRevisor(String revisorId) {
        Optional<Usuario> usuario = usuarioRepository.findByIdCognito(revisorId);
        if (usuario.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado con ID Cognito: " + revisorId);
        }
        Usuario user = usuario.get();
        List<Object[]> result = revisionDocumentoRepository.listarRevisionDocumentosPorRevisor(user.getId());
        List<RevisionDocumentoRevisorDto> documentos = new ArrayList<>();
        for (Object[] row : result) {
            RevisionDocumentoRevisorDto dto = new RevisionDocumentoRevisorDto();

            dto.setId((Integer) row[0]); // revision_id
            dto.setTitulo((String) row[1]); // tema
            dto.setEntregable((String) row[2]); // entregable
            dto.setEstudiante((String) row[3]); // estudiante
            dto.setCodigo((String) row[4]); // código PUCP
            dto.setCurso((String) row[5]); // curso

            dto.setFechaEntrega(row[6] != null
                    ? ((Instant) row[6]).atOffset(ZoneOffset.UTC)
                    : null);

            dto.setEstado((String) row[7]); // estado_revision

            dto.setFechaLimiteRevision(row[9] != null
                    ? ((Instant) row[9]).atOffset(ZoneOffset.UTC)
                    : null); // fecha_limite

            dto.setPorcentajeSimilitud(row[10] != null ? ((Number) row[10]).doubleValue() : null);
            dto.setPorcentajeGenIA(row[11] != null ? ((Number) row[11]).doubleValue() : null);

            documentos.add(dto);
        }
        return documentos;
    }

    public List<RevisionDocumentoAsesorDto> listarRevisionDocumentosPorJurado(String juradoId) {
        Optional<Usuario> usuario = usuarioRepository.findByIdCognito(juradoId);
        if (usuario.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado con ID Cognito: " + juradoId);
        }

        Usuario user = usuario.get();
        List<Object[]> result = revisionDocumentoRepository.listarRevisionDocumentosPorJurado(user.getId());
        List<RevisionDocumentoAsesorDto> documentos = new ArrayList<>();

        for (Object[] row : result) {
            RevisionDocumentoAsesorDto dto = new RevisionDocumentoAsesorDto();

            dto.setId((Integer) row[0]); // revision_id
            dto.setTitulo((String) row[1]); // tema
            dto.setEntregable((String) row[2]); // entregable
            dto.setEstudiante((String) row[3]); // estudiante
            dto.setCodigo((String) row[4]); // código PUCP
            dto.setCurso((String) row[5]); // curso

            dto.setFechaEntrega(row[6] != null
                    ? ((Instant) row[6]).atOffset(ZoneOffset.UTC)
                    : null); // fecha_carga

            dto.setEstado((String) row[7]); // estado_revision

            dto.setFechaLimiteRevision(row[9] != null
                    ? ((Instant) row[9]).atOffset(ZoneOffset.UTC)
                    : null); // fecha_limite

            documentos.add(dto);
        }
        return documentos;
    }
    @Override
    @Transactional
    public void actualizarEstadoTodosRevisiones(Integer revisionId, String nuevoEstado) {
        System.out.println(">>> Actualizando todas las revisiones relacionadas al entregable_x_tema con ID: " + revisionId + " al estado: " + nuevoEstado);

        // Llamas al repositorio con la nueva consulta que actualiza todas las revisiones
        revisionDocumentoRepository.actualizarEstadoTodosRevisiones(revisionId, nuevoEstado);
    }
    @Override
    public List<RevisoresTemaDTO> listarRevisoresYJuradosPorTemaId(Integer temaId) {
        List<Object[]> result = revisionDocumentoRepository.listarRevisoresYJuradosPorTemaId(temaId);
        List<RevisoresTemaDTO> lista = new ArrayList<>();

        for (Object[] row : result) {
            RevisoresTemaDTO dto = new RevisoresTemaDTO();

            dto.setUsuarioId(row[0] != null ? ((Number) row[0]).intValue() : null);         // usuario_id
            dto.setNombres(row[1] != null ? row[1].toString() : null);                     // nombres
            dto.setPrimerApellido(row[2] != null ? row[2].toString() : null);              // primer_apellido
            dto.setSegundoApellido(row[3] != null ? row[3].toString() : null);             // segundo_apellido
            dto.setRolId(row[4] != null ? ((Number) row[4]).intValue() : null);            // rol_id
            dto.setTemaId(row[5] != null ? ((Number) row[5]).intValue() : null);           // tema_id

            lista.add(dto);
        }

        return lista;
    }
}