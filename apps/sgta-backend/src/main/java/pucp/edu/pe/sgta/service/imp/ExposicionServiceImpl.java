package pucp.edu.pe.sgta.service.imp;

import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.*;
import pucp.edu.pe.sgta.dto.asesores.UsuarioConRolDto;
import pucp.edu.pe.sgta.dto.exposiciones.MiembroExposicionDto;
import pucp.edu.pe.sgta.mapper.ExposicionMapper;
import pucp.edu.pe.sgta.model.*;
import pucp.edu.pe.sgta.repository.BloqueHorarioExposicionRepository;
import pucp.edu.pe.sgta.repository.ExposicionRepository;
import pucp.edu.pe.sgta.repository.UsuarioXTemaRepository;
import pucp.edu.pe.sgta.service.inter.BloqueHorarioExposicionService;
import pucp.edu.pe.sgta.service.inter.ExposicionService;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExposicionServiceImpl implements ExposicionService {
    private final ExposicionRepository exposicionRepository;
    private final UsuarioXTemaRepository usuarioXTemaRepository;
    private final BloqueHorarioExposicionService bloqueHorarioExposicionService;

    public ExposicionServiceImpl(ExposicionRepository exposicionRepository,
            UsuarioXTemaRepository usuarioXTemaRepository,
            BloqueHorarioExposicionService bloqueHorarioExposicionService) {
        this.exposicionRepository = exposicionRepository;
        this.usuarioXTemaRepository = usuarioXTemaRepository;
        this.bloqueHorarioExposicionService = bloqueHorarioExposicionService;
    }

    @Override
    public List<ExposicionDto> listarExposicionesXEtapaFormativaXCiclo(Integer etapaFormativaXCicloId) {

        List<Object[]> resultados = exposicionRepository
                .listarExposicionesXEtapaFormativaXCiclo(etapaFormativaXCicloId);
        return resultados.stream()
                .map(resultado -> new ExposicionDto(
                        ((Number) resultado[0]).intValue(), // id
                        ((Number) resultado[1]).intValue(), // id etapa formativa x ciclo
                        (String) resultado[2], // nombre
                        (String) resultado[3], // descripcion
                        ((Number) resultado[4]).intValue(), // id estado planificacion
                        ((Number) resultado[5]).intValue() // id entregable
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<ExposicionDto> getAll() {
        List<Exposicion> exposiciones = exposicionRepository.findAll();
        return exposiciones.stream().map(ExposicionMapper::toDto).collect(Collectors.toList());
    }

    @Override
    public ExposicionDto findById(Integer id) {
        return exposicionRepository.findById(id)
                .map(ExposicionMapper::toDto)
                .orElse(null);
    }

    @Transactional
    @Override
    public Integer create(Integer etapaFormativaXCicloId, ExposicionDto dto) {
        dto.setId(null);
        Exposicion exposicion = ExposicionMapper.toEntity(dto);
        EtapaFormativaXCiclo efc = new EtapaFormativaXCiclo();
        efc.setId(etapaFormativaXCicloId);
        exposicion.setEtapaFormativaXCiclo(efc);
        Entregable entregable = new Entregable();
        entregable.setId(dto.getEntregableId());
        exposicion.setEntregable(entregable);
        exposicion.setFechaCreacion(OffsetDateTime.now());

        exposicionRepository.save(exposicion);
        exposicionRepository.asociarTemasAExposicion(exposicion.getId(), etapaFormativaXCicloId);
        return exposicion.getId();
    }

    @Transactional
    @Override
    public void update(ExposicionDto dto) {
        Exposicion exposicionToUpdate = exposicionRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Exposicion no encontrada con ID: " + dto.getId()));

        exposicionToUpdate.setNombre(dto.getNombre());

        EstadoPlanificacion estadoPlanificacion = new EstadoPlanificacion();
        estadoPlanificacion.setId(dto.getEstadoPlanificacionId());
        exposicionToUpdate.setEstadoPlanificacion(estadoPlanificacion);

        Entregable entregable = new Entregable();
        entregable.setId(dto.getEntregableId());
        exposicionToUpdate.setEntregable(entregable);

        exposicionToUpdate.setDescripcion(dto.getDescripcion());
        exposicionToUpdate.setFechaModificacion(OffsetDateTime.now());
        exposicionRepository.save(exposicionToUpdate);
    }

    @Override
    public void delete(Integer id) {
        Exposicion exposicionToDelete = exposicionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exposicion no encontrada con ID: " + id));

        exposicionToDelete.setActivo(false);
        exposicionToDelete.setFechaModificacion(OffsetDateTime.now());
        exposicionRepository.save(exposicionToDelete);
    }

    @Override
    public List<ExposicionNombreDTO> listarExposicionXCicloActualEtapaFormativa(Integer etapaFormativaId) {
        List<Object[]> expos = exposicionRepository.listarExposicionXCicloActualEtapaFormativa(etapaFormativaId);

        List<ExposicionNombreDTO> expoList = new ArrayList<>();

        for (Object[] obj : expos) {
            ExposicionNombreDTO dto = new ExposicionNombreDTO();
            dto.setId((Integer) obj[0]);
            dto.setNombre((String) obj[1]);
            expoList.add(dto);
        }

        return expoList;
    }

    @Override
    public List<ListExposicionXCoordinadorDTO> listarExposicionesInicializadasXCoordinador(Integer coordinadorId) {
        List<Object[]> resultados = exposicionRepository.listarExposicionesInicializadasXCoordinador(coordinadorId);
        return resultados.stream()
                .map(resultado -> new ListExposicionXCoordinadorDTO(
                        ((Number) resultado[0]).intValue(), // exposicionId
                        (String) resultado[1], // nombre
                        (String) resultado[2], // descripcion
                        ((Number) resultado[3]).intValue(), // etapaFormativaId
                        (String) resultado[4], // etapaFormativaNombre
                        ((Number) resultado[5]).intValue(), // cicloId
                        (String) resultado[6], // cicloNombre
                        ((Number) resultado[7]).intValue(), // estadoPlanificacionId
                        (String) resultado[8] // estadoPlanificacionNombre
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<ExposicionSinInicializarDTO> listarExposicionesSinInicializarByEtapaFormativaEnCicloActual(
            Integer etapaFormativaId) {
        List<Object[]> expos = exposicionRepository
                .listarExposicionesSinInicializarByEtapaFormativaEnCicloActual(etapaFormativaId);

        List<ExposicionSinInicializarDTO> expoList = new ArrayList<>();

        for (Object[] obj : expos) {
            ExposicionSinInicializarDTO dto = new ExposicionSinInicializarDTO();
            dto.setExposicionId((Integer) obj[0]);
            dto.setNombre((String) obj[1]);
            dto.setInicializada((Boolean) obj[2]);
            expoList.add(dto);
        }

        return expoList;
    }

    @Override
    public List<ExposicionEstudianteDTO> findExposicionesEstudianteById(Integer usuarioId) {
        List<Object[]> exposiciones = exposicionRepository.obtener_exposiciones_por_usuario(usuarioId);
        List<ExposicionEstudianteDTO> exposicionesEstudiante = new ArrayList<>();

        for (Object[] obj : exposiciones) {
            ExposicionEstudianteDTO dto = new ExposicionEstudianteDTO();
            dto.setExposicionId((Integer) obj[0]);
            dto.setTemaId((Integer) obj[1]);
            dto.setEstado((String) obj[2]);
            dto.setLinkExposicion((String) obj[3]);
            dto.setLinkGrabacion((String) obj[4]);

            Instant instantInicio = (Instant) obj[5];
            OffsetDateTime datetimeInicio = instantInicio.atOffset(ZoneOffset.UTC);

            Instant instantFin = (Instant) obj[6];
            OffsetDateTime datetimeFin = instantFin.atOffset(ZoneOffset.UTC);

            dto.setDatetimeInicio(datetimeInicio);
            dto.setDatetimeFin(datetimeFin);

            dto.setSala((String) obj[7]);
            dto.setTitulo((String) obj[8]);
            dto.setEtapaFormativa((String) obj[9]);
            dto.setCiclo((String) obj[10]);
            dto.setTipoExposicion((String) obj[11]);
            dto.setEstudianteId(usuarioId);
            dto.setNotaFinal((BigDecimal) obj[12]);

            List<UsuarioXTema> usuarioTemas = usuarioXTemaRepository.findByTemaIdAndActivoTrue(dto.getTemaId());
            List<MiembroExposicionDto> miembros = usuarioTemas.stream()
                    .filter(ut -> !ut.getRol().getNombre().equals("Tesista")).map(ut -> {
                        MiembroExposicionDto miembro = new MiembroExposicionDto();
                        miembro.setId_persona(ut.getUsuario().getId());
                        miembro.setNombre(ut.getUsuario().getNombres() + " " + ut.getUsuario().getPrimerApellido());
                        miembro.setTipo(ut.getRol().getNombre());
                        return miembro;
                    }).toList();
            dto.setMiembrosJurado(miembros);
            exposicionesEstudiante.add(dto);
        }

        return exposicionesEstudiante;
    }

    @Override
    public byte[] exportarExcel(Integer expoId) {
        List<ListBloqueHorarioExposicionSimpleDTO> lista = bloqueHorarioExposicionService
                .listarBloquesHorarioPorExposicion(expoId);
        List<ListBloqueHorarioExposicionSimpleDTO> listaFiltrada = lista.stream().filter(l -> l.getExpo() != null)
                .toList();
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Reporte");

            // Encabezado + datos
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Tema");
            headerRow.createCell(1).setCellValue("Descripcion");
            headerRow.createCell(2).setCellValue("Jurado 1");
            headerRow.createCell(3).setCellValue("Jurado 2");
            headerRow.createCell(4).setCellValue("Asesor");
            headerRow.createCell(5).setCellValue("Hora");
            headerRow.createCell(6).setCellValue("Salon");
            headerRow.createCell(7).setCellValue("Tesista");
            headerRow.createCell(8).setCellValue("Revisor 1");
            headerRow.createCell(9).setCellValue("Revisor 2");
            int rowNum = 1;
            for (ListBloqueHorarioExposicionSimpleDTO dto : listaFiltrada) {
                Row dataRow = sheet.createRow(rowNum++);
                dataRow.createCell(0).setCellValue(dto.getExpo().getCodigo());
                dataRow.createCell(1).setCellValue(dto.getExpo().getTitulo());
                UsarioRolDto tesista = null;
                UsarioRolDto jurado1 = null;
                UsarioRolDto jurado2 = null;
                UsarioRolDto asesor = null;
                UsarioRolDto revisor1 = null;
                UsarioRolDto revisor2 = null;
                for (UsarioRolDto us : dto.getExpo().getUsuarios()) {
                    String rol = us.getRol().getNombre();

                    if ("Tesista".equals(rol)) {
                        tesista = us;
                    } else if ("Asesor".equals(rol)) {
                        asesor = us;
                    } else if ("Jurado".equals(rol)) {
                        if (jurado1 == null) {
                            jurado1 = us;
                        } else if (jurado2 == null) {
                            jurado2 = us;
                        }
                    } else if ("Revisor".equals(rol)) {
                        if (revisor1 == null) {
                            revisor1 = us;
                        } else if (revisor2 == null) {
                            revisor2 = us;
                        }
                    }
                }
                if (jurado1 != null) {
                    dataRow.createCell(2).setCellValue(jurado1.getNombres() + " " + jurado1.getApellidos());
                }
                if (jurado2 != null) {
                    dataRow.createCell(3).setCellValue(jurado2.getNombres() + " " + jurado2.getApellidos());
                }

                if (asesor != null) {
                    dataRow.createCell(4).setCellValue(asesor.getNombres() + " " + asesor.getApellidos());
                }

                String[] partes = dto.getKey().split("\\|");
                String hora = partes[1];
                String salon = partes[2];
                dataRow.createCell(5).setCellValue(hora);
                dataRow.createCell(6).setCellValue(salon);
                if (tesista != null) {
                    dataRow.createCell(7).setCellValue(tesista.getNombres() + " " + tesista.getApellidos());
                }
                if (revisor1 != null) {
                    dataRow.createCell(8).setCellValue(revisor1.getNombres() + " " + revisor1.getApellidos());
                }
                if (revisor2 != null) {
                    dataRow.createCell(9).setCellValue(revisor2.getNombres() + " " + revisor2.getApellidos());
                }

            }

            // Convertir a byte array
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            String rutaArchivo = "/home/darkmoon/Descargas/reporte.xlsx"; // o cualquier ruta válida
            /*
             * try (FileOutputStream fileOut = new FileOutputStream(rutaArchivo)) {
             * workbook.write(fileOut);
             * }
             */
            return outputStream.toByteArray(); // ✅ Retornar aquí
        } catch (Exception e) {
            e.printStackTrace();
            return null; // ❌ Mejor manejar con excepción personalizada si es producción
        }
    }
}
