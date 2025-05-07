package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.MiembroJuradoDto;
import pucp.edu.pe.sgta.repository.UsuarioRepository;
import pucp.edu.pe.sgta.service.inter.AutorService;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AutorServiceImpl implements AutorService {

    private final UsuarioRepository usuarioRepository;

    public AutorServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }


    @Override
    public List<MiembroJuradoDto> obtenerUsuarioTemaInfo() {

        List<Object[]> rows = usuarioRepository.findUsuarioTemaInfo();
        List<MiembroJuradoDto> resultList = new ArrayList<>();

        for (Object[] row : rows) {
            // Obtener las especialidades para este usuario
            List<String> especialidades = this.findAreaConocimientoByUsuarioId(((Number) row[0]).intValue())
                    .stream()
                    .map(obj -> (String) obj[1])
                    .collect(Collectors.toList());

            Instant fechaAsignacionInstant = (Instant) row[9];
            OffsetDateTime fechaAsignacion = fechaAsignacionInstant.atOffset(OffsetDateTime.now().getOffset());


            MiembroJuradoDto dto = new MiembroJuradoDto(
                    ((Number) row[0]).intValue(),   // usuario_id
                    (String) row[1],    // codigo_pucp
                    (String) row[2],    // nombres
                    (String) row[3],    // primer_apellido
                    (String) row[4],    // segundo_apellido
                    (String) row[5],    // correo_electronico
                    (String) row[6],    // nivel_estudios
                    ((Number) row[7]).intValue(),      // cantidad_temas_asignados
                    "TPA",                             // harcodeado
                    (boolean) row[8],
                    fechaAsignacion,    // fecha_asignacion convertida a OffsetDateTime
                    especialidades
            );
            resultList.add(dto);
        }

        return resultList;
    }

    @Override
    public List<Object[]> findAreaConocimientoByUsuarioId(Integer usuarioId) {
        return usuarioRepository.findAreaConocimientoByUsuarioId(usuarioId);
    }

    @Override
    public List<MiembroJuradoDto> obtenerUsuariosPorEstado(Boolean activoParam) {
        List<Object[]> rows = usuarioRepository.obtenerUsuariosPorEstado(activoParam);
        List<MiembroJuradoDto> resultList = new ArrayList<>();

        for (Object[] row : rows) {
            // Obtener las especialidades para este usuario
            List<String> especialidades = this.findAreaConocimientoByUsuarioId(((Number) row[0]).intValue())
                    .stream()
                    .map(obj -> (String) obj[1])
                    .collect(Collectors.toList());

            Instant fechaAsignacionInstant = (Instant) row[9];
            OffsetDateTime fechaAsignacion = fechaAsignacionInstant.atOffset(OffsetDateTime.now().getOffset());


            MiembroJuradoDto dto = new MiembroJuradoDto(
                    ((Number) row[0]).intValue(),   // usuario_id
                    (String) row[1],    // codigo_pucp
                    (String) row[2],    // nombres
                    (String) row[3],    // primer_apellido
                    (String) row[4],    // segundo_apellido
                    (String) row[5],    // correo_electronico
                    (String) row[6],    // nivel_estudios
                    ((Number) row[7]).intValue(),      // cantidad_temas_asignados
                    "TPA",                             // harcodeado
                    (boolean) row[8],
                    fechaAsignacion,    // fecha_asignacion convertida a OffsetDateTime
                    especialidades
            );
            resultList.add(dto);
        }

        return resultList;

    }

    @Override
    public List<MiembroJuradoDto> obtenerUsuariosPorAreaConocimiento(Integer areaConocimientoId) {
        List<Object[]> rows = usuarioRepository.obtenerUsuariosPorAreaConocimiento(areaConocimientoId);
        List<MiembroJuradoDto> resultList = new ArrayList<>();
        for (Object[] row : rows) {
            // Obtener las especialidades para este usuario
            List<String> especialidades = this.findAreaConocimientoByUsuarioId(((Number) row[0]).intValue())
                    .stream()
                    .map(obj -> (String) obj[1])
                    .collect(Collectors.toList());

            Instant fechaAsignacionInstant = (Instant) row[9];
            OffsetDateTime fechaAsignacion = fechaAsignacionInstant.atOffset(OffsetDateTime.now().getOffset());


            MiembroJuradoDto dto = new MiembroJuradoDto(
                    ((Number) row[0]).intValue(),   // usuario_id
                    (String) row[1],    // codigo_pucp
                    (String) row[2],    // nombres
                    (String) row[3],    // primer_apellido
                    (String) row[4],    // segundo_apellido
                    (String) row[5],    // correo_electronico
                    (String) row[6],    // nivel_estudios
                    ((Number) row[7]).intValue(),      // cantidad_temas_asignados
                    "TPA",                             // harcodeado
                    (boolean) row[8],
                    fechaAsignacion,    // fecha_asignacion convertida a OffsetDateTime
                    especialidades
            );
            resultList.add(dto);
        }

        return resultList;
    }


}
