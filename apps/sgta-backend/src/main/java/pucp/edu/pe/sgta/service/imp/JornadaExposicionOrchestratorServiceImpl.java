package pucp.edu.pe.sgta.service.imp;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import pucp.edu.pe.sgta.dto.BloqueHorarioExposicionCreateDTO;
import pucp.edu.pe.sgta.dto.EtapaFormativaDto;
import pucp.edu.pe.sgta.dto.ExposicionDto;
import pucp.edu.pe.sgta.dto.IniatilizeJornadasExposicionCreateDTO;
import pucp.edu.pe.sgta.dto.JornadaExposicionCreateDTO;
import pucp.edu.pe.sgta.dto.JornadaExposicionDto;
import pucp.edu.pe.sgta.dto.JornadaExposicionXSalaExposicionCreateDTO;
import pucp.edu.pe.sgta.dto.JornadaExposicionXSalaExposicionDto;
import pucp.edu.pe.sgta.repository.ControlExposicionUsuarioTemaRepository;
import pucp.edu.pe.sgta.service.inter.BloqueHorarioExposicionService;
import pucp.edu.pe.sgta.service.inter.EtapaFormativaService;
import pucp.edu.pe.sgta.service.inter.ExposicionService;
import pucp.edu.pe.sgta.service.inter.JornadaExposicionOrchestratorService;
import pucp.edu.pe.sgta.service.inter.JornadaExposicionService;
import pucp.edu.pe.sgta.service.inter.JornadaExposicionXSalaExposicionService;

@Service
public class JornadaExposicionOrchestratorServiceImpl implements JornadaExposicionOrchestratorService {
    @Autowired
    private JornadaExposicionService jornadaExposicionService;
    @Autowired
    private JornadaExposicionXSalaExposicionService jornadaExposicionXSalaExposicionService;
    @Autowired
    private EtapaFormativaService etapaFormativaService;
    @Autowired
    private BloqueHorarioExposicionService bloqueHorarioExposicionService;
    @Autowired
    private ExposicionService exposicionService;
    @Autowired
    private ControlExposicionUsuarioTemaRepository controlExposicionUsuarioTemaRepository;

    @Override
    @Transactional
    public ResponseEntity<?> initializeJornadasExposicion(IniatilizeJornadasExposicionCreateDTO dto) {

        EtapaFormativaDto etapaFormativaDto = etapaFormativaService.findById(dto.getEtapaFormativaId());
        List<BloqueHorarioExposicionCreateDTO> bloqueHorarioExposicionCreateDTOs = new ArrayList<BloqueHorarioExposicionCreateDTO>();

        for (var fecha : dto.getFechas()) {
            for (var sala : fecha.getSalas()) {
                boolean ocupada = bloqueHorarioExposicionService.verificarSalaOcupada(
                        sala, fecha.getFechaHoraInicio(), fecha.getFechaHoraFin());

                if (ocupada) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(
                            Map.of("mensaje",
                                    "No se puede asignar la sala " + sala +
                                            " porque ya está ocupada en el rango de fechas " +
                                            fecha.getFechaHoraInicio() + " a " + fecha.getFechaHoraFin()));
                }
            }
        }

        

        dto.getFechas().forEach(fecha -> {
            JornadaExposicionCreateDTO createDTO = new JornadaExposicionCreateDTO();
            createDTO.setDatetimeInicio(fecha.getFechaHoraInicio());
            createDTO.setDatetimeFin(fecha.getFechaHoraFin());
            createDTO.setExposicionId(dto.getExposicionId());
            JornadaExposicionDto jornadaExposicionDto = jornadaExposicionService.create(createDTO);

            fecha.getSalas().forEach(sala -> {
                JornadaExposicionXSalaExposicionCreateDTO salaExposicionCreateDTO = new JornadaExposicionXSalaExposicionCreateDTO();
                salaExposicionCreateDTO.setJornadaExposicionId(jornadaExposicionDto.getId());
                salaExposicionCreateDTO.setSalaExposicionId(sala);
                JornadaExposicionXSalaExposicionDto jornadaExposicionXSalaExposicionDto = jornadaExposicionXSalaExposicionService
                        .create(salaExposicionCreateDTO);

                Duration duracionBloque = etapaFormativaDto.getDuracionExposicion();

                OffsetDateTime actualInicio = createDTO.getDatetimeInicio();
                OffsetDateTime finJornada = createDTO.getDatetimeFin();

                while (!actualInicio.plus(duracionBloque).isAfter(finJornada)) {
                    OffsetDateTime actualFin = actualInicio.plus(duracionBloque);

                    BloqueHorarioExposicionCreateDTO bloqueHorarioExposicionCreateDTO = new BloqueHorarioExposicionCreateDTO();
                    bloqueHorarioExposicionCreateDTO
                            .setJornadaExposicionXSalaId(jornadaExposicionXSalaExposicionDto.getId());
                    bloqueHorarioExposicionCreateDTO.setDatetimeInicio(actualInicio);
                    bloqueHorarioExposicionCreateDTO.setDatetimeFin(actualFin);

                    bloqueHorarioExposicionCreateDTOs.add(bloqueHorarioExposicionCreateDTO);

                    actualInicio = actualFin;
                }
            });
        });

        bloqueHorarioExposicionService.createAll(bloqueHorarioExposicionCreateDTOs);

        ExposicionDto exposicionDto = exposicionService.findById(dto.getExposicionId());
        exposicionDto.setEstadoPlanificacionId(2);
        exposicionService.update(exposicionDto);

        controlExposicionUsuarioTemaRepository.insertarControlesDeExposicion(dto.getExposicionId(),
                dto.getEtapaFormativaId());

        return ResponseEntity.ok(Map.of("mensaje", "Registro inicial de planificación registrado correctamente"));
    }
}
