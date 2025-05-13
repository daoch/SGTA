package pucp.edu.pe.sgta.service.imp;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.BloqueHorarioExposicionCreateDTO;
import pucp.edu.pe.sgta.dto.BloqueHorarioExposicionDto;
import pucp.edu.pe.sgta.dto.ListBloqueHorarioExposicionSimpleDTO;
import pucp.edu.pe.sgta.mapper.BloqueHorarioExposicionMapper;
import pucp.edu.pe.sgta.model.BloqueHorarioExposicion;
import pucp.edu.pe.sgta.repository.BloqueHorarioExposicionRepository;
import pucp.edu.pe.sgta.service.inter.BloqueHorarioExposicionService;

@Service
public class BloqueHorarioExposicionServiceImpl implements BloqueHorarioExposicionService {

    private final BloqueHorarioExposicionRepository bloqueHorarioExposicionRepository;

    public BloqueHorarioExposicionServiceImpl(BloqueHorarioExposicionRepository bloqueHorarioExposicionRepository) {
        this.bloqueHorarioExposicionRepository = bloqueHorarioExposicionRepository;
    }

    @Override
    public List<BloqueHorarioExposicionDto> getAll() {
        return List.of();
    }

    @Override
    public BloqueHorarioExposicionDto findById(Integer id) {
        BloqueHorarioExposicion bloqueHorarioExposicion = bloqueHorarioExposicionRepository.findById(id).orElse(null);
        if (bloqueHorarioExposicion != null) {
            return BloqueHorarioExposicionMapper.toDTO(bloqueHorarioExposicion);
        }
        return null;
    }

    @Override
    public BloqueHorarioExposicionDto create(BloqueHorarioExposicionCreateDTO dto) {
        BloqueHorarioExposicion bloqueHorarioExposicion = bloqueHorarioExposicionRepository.save(BloqueHorarioExposicionMapper.toEntity(dto));
        return BloqueHorarioExposicionMapper.toDTO(bloqueHorarioExposicion);
    }

    @Override
    public void update(BloqueHorarioExposicionDto dto) {

    }

    @Override
    public void delete(Integer id) {

    }

    @Override
    public List<ListBloqueHorarioExposicionSimpleDTO> listarBloquesHorarioPorExposicion(Integer exposicionId) {
        List<Object[]> results = bloqueHorarioExposicionRepository.listarBloquesHorarioPorExposicion(exposicionId);
        
        //Asi deberia ser :V
        // return results.stream().map(row -> new ListBloqueHorarioExposicionDTO(
        //     (Integer) row[0],
        //     (Integer) row[1],
        //     (Integer) row[2],
        //     (Boolean) row[3],
        //     (Boolean) row[4],
        //     OffsetDateTime.ofInstant((Instant) row[5], ZoneId.systemDefault()),
        //     OffsetDateTime.ofInstant((Instant) row[6], ZoneId.systemDefault()),
        //     (String) row[7]
        // )).collect(Collectors.toList());

        //solucion temporal
        DateTimeFormatter fechaFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        DateTimeFormatter horaFormatter = DateTimeFormatter.ofPattern("HH:mm");

        return results.stream().map(row -> {
            OffsetDateTime inicio = OffsetDateTime.ofInstant((Instant) row[5], ZoneId.systemDefault());
            OffsetDateTime fin = OffsetDateTime.ofInstant((Instant) row[6], ZoneId.systemDefault());

            String key = inicio.format(fechaFormatter) + "|" + inicio.format(horaFormatter) + "|" + row[7];
            String range = inicio.format(horaFormatter) + " - " + fin.format(horaFormatter);
            Integer idBloque = (Integer) row[0];

            return new ListBloqueHorarioExposicionSimpleDTO(key, range, idBloque);
        }).collect(Collectors.toList());
    }
}
